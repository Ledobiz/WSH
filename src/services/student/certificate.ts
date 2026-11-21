'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { requireUser } from "@/src/lib/auth-guard";
import { signCertificateUploads, verifyCertificateAsset, CertificateAssetKind } from "@/src/lib/certificate-assets";
import {
    CERTIFICATE_LIMITS,
    normalizeCertificateName,
    UploadedAsset,
    validateCertificateName,
} from "@/src/utils/certificate";

// A course is eligible for a certificate when the course offers one and the
// student has completed all its lectures.
const eligibleEnrollmentWhere = (userId: string) => ({
    userId,
    deletedAt: null,
    lecturesCompleted: true,
    course: { hasCertificate: true, deletedAt: null },
});

export const getMyCertificates = async () => {
    try {
        const user = await requireUser();

        const enrollments = await prisma.student.findMany({
            where: eligibleEnrollmentWhere(user.id),
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                updatedAt: true,
                course: { select: { id: true, title: true, thumbnail: true } },
                certificateRequest: {
                    select: {
                        id: true,
                        status: true,
                        certificateName: true,
                        signatureUrl: true,
                        rejectionReason: true,
                        attempt: true,
                        submittedAt: true,
                        reviewedAt: true,
                        approvedAt: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: "Success",
            certificates: enrollments.map((e) => ({
                courseId: e.course.id,
                courseTitle: e.course.title,
                thumbnail: e.course.thumbnail,
                completedAt: e.updatedAt.toISOString(),
                request: e.certificateRequest
                    ? {
                        ...e.certificateRequest,
                        submittedAt: e.certificateRequest.submittedAt.toISOString(),
                        reviewedAt: e.certificateRequest.reviewedAt?.toISOString() ?? null,
                        approvedAt: e.certificateRequest.approvedAt?.toISOString() ?? null,
                    }
                    : null,
            })),
        };
    } catch (error) {
        console.log("Error fetching certificates:", error);
        return { success: false, message: "Failed to load your certificates.", certificates: [] };
    }
};

export const getCertificateUploadSignatures = async (kind: CertificateAssetKind, count: number) => {
    try {
        const user = await requireUser();
        if (kind !== "practicals" && kind !== "signatures") throw new Error("Invalid upload kind");

        const max = kind === "signatures" ? 1 : CERTIFICATE_LIMITS.maxFiles;
        const safeCount = Math.max(1, Math.min(Math.floor(Number(count) || 1), max));

        return { success: true, uploads: signCertificateUploads(user.id, kind, safeCount) };
    } catch (error) {
        console.log("Error signing certificate uploads:", error);
        return { success: false, message: "Could not prepare the upload. Please try again.", uploads: [] };
    }
};

interface SubmitCertificateInput {
    courseId: string;
    name?: string;               // required on first submission; ignored afterwards
    signature?: UploadedAsset;   // required on first submission; optional on re-submission
    files: UploadedAsset[];
}

const toFileRow = (file: UploadedAsset, attempt: number) => ({
    url: file.secureUrl,
    publicId: file.publicId,
    resourceType: file.resourceType,
    bytes: Number.isFinite(Number(file.bytes)) ? Math.round(Number(file.bytes)) : null,
    attempt,
});

export const submitCertificateRequest = async (input: SubmitCertificateInput) => {
    try {
        const user = await requireUser();

        const enrollment = await prisma.student.findFirst({
            where: { ...eligibleEnrollmentWhere(user.id), courseId: input.courseId },
            select: { id: true, courseId: true, certificateRequest: true },
        });

        if (!enrollment) {
            return { success: false, message: "You can request a certificate only for completed courses that offer one." };
        }

        // Practicals
        const files = Array.isArray(input.files) ? input.files : [];
        if (files.length === 0) return { success: false, message: "Please upload at least one picture or video of your practicals." };
        if (files.length > CERTIFICATE_LIMITS.maxFiles) return { success: false, message: `You can upload up to ${CERTIFICATE_LIMITS.maxFiles} files.` };
        if (new Set(files.map((f) => f?.publicId)).size !== files.length) return { success: false, message: "The same file was added twice." };
        for (const file of files) {
            const error = verifyCertificateAsset(file, user.id, "practicals");
            if (error) return { success: false, message: error };
        }

        // Signature (optional on re-submission)
        if (input.signature) {
            const error = verifyCertificateAsset(input.signature, user.id, "signatures");
            if (error) return { success: false, message: error };
        }

        const existing = enrollment.certificateRequest;

        if (!existing) {
            // ---- First submission: the name is set here, permanently. ----
            const nameError = validateCertificateName(input.name ?? "");
            if (nameError) return { success: false, message: nameError };
            if (!input.signature) return { success: false, message: "Please add your signature." };

            const name = normalizeCertificateName(input.name!);

            try {
                await prisma.certificateRequest.create({
                    data: {
                        studentId: enrollment.id,
                        userId: user.id,
                        courseId: enrollment.courseId,
                        certificateName: name,
                        originalName: name,
                        signatureUrl: input.signature.secureUrl,
                        signaturePublicId: input.signature.publicId,
                        files: { create: files.map((f) => toFileRow(f, 1)) },
                    },
                });
            } catch (error: any) {
                if (error?.code === "P2002") {
                    return { success: false, message: "You have already submitted a request for this course." };
                }
                throw error;
            }

            return { success: true, message: "Your certificate request has been submitted for review." };
        }

        // ---- Re-submission: only allowed after a rejection; the name is never changed. ----
        if (existing.status === "pending") return { success: false, message: "Your request is already awaiting review." };
        if (existing.status === "approved") return { success: false, message: "Your certificate has already been approved." };

        const attempt = existing.attempt + 1;

        // Conditional update guards against a concurrent review or double submit.
        const updated = await prisma.$transaction(async (tx) => {
            const result = await tx.certificateRequest.updateMany({
                where: { id: existing.id, status: "rejected", attempt: existing.attempt },
                data: {
                    status: "pending",
                    attempt,
                    submittedAt: new Date(),
                    reviewedAt: null,
                    reviewedById: null,
                    ...(input.signature
                        ? { signatureUrl: input.signature.secureUrl, signaturePublicId: input.signature.publicId }
                        : {}),
                },
            });
            if (result.count === 0) return false;

            await tx.certificateRequestFile.createMany({
                data: files.map((f) => ({ ...toFileRow(f, attempt), requestId: existing.id })),
            });
            return true;
        });

        if (!updated) return { success: false, message: "Your request changed while you were re-submitting. Please refresh and try again." };

        return { success: true, message: "Your certificate request has been re-submitted for review." };
    } catch (error) {
        console.log("Error submitting certificate request:", error);
        return { success: false, message: "Failed to submit your request. Please try again." };
    }
};
