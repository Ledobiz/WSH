'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Resend } from "resend";
import { render } from "@react-email/render";
import prisma from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth-guard";
import { paginateQuery } from "@/src/utils/pagination";
import CertificateStatusEmail from "@/src/components/emails/CertificateStatusEmail";
import {
    CERTIFICATE_LIMITS,
    CertificateStatus,
    normalizeCertificateName,
    validateCertificateName,
} from "@/src/utils/certificate";

const STATUSES: CertificateStatus[] = ["pending", "approved", "rejected"];

export const getCertificateRequests = async (options: {
    status?: CertificateStatus | "all";
    search?: string;
    page?: number;
    pageSize?: number;
} = {}) => {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 20;

    try {
        await requireAdmin();

        const search = options.search?.trim();
        const where: any = {
            ...(options.status && options.status !== "all" ? { status: options.status } : {}),
            ...(search
                ? {
                    OR: [
                        { certificateName: { contains: search, mode: "insensitive" } },
                        { user: { name: { contains: search, mode: "insensitive" } } },
                        { user: { email: { contains: search, mode: "insensitive" } } },
                        { course: { title: { contains: search, mode: "insensitive" } } },
                    ],
                }
                : {}),
        };

        const [result, grouped] = await Promise.all([
            paginateQuery<any>({
                page,
                pageSize,
                dataQuery: ({ skip, take }) => prisma.certificateRequest.findMany({
                    where,
                    // Oldest pending first so nothing waits too long; others newest first.
                    orderBy: options.status === "pending" ? { submittedAt: "asc" } : { submittedAt: "desc" },
                    skip,
                    take,
                    select: {
                        id: true,
                        status: true,
                        certificateName: true,
                        attempt: true,
                        submittedAt: true,
                        reviewedAt: true,
                        user: { select: { name: true, email: true } },
                        course: { select: { title: true } },
                        _count: { select: { files: true } },
                    },
                }),
                countQuery: () => prisma.certificateRequest.count({ where }),
            }),
            prisma.certificateRequest.groupBy({ by: ["status"], _count: { _all: true } }),
        ]);

        const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<CertificateStatus, number>;
        grouped.forEach((g) => { counts[g.status as CertificateStatus] = g._count._all; });

        return { ...result, counts };
    } catch (error) {
        console.log("Error fetching certificate requests:", error);
        return {
            success: false,
            message: "Failed to load certificate requests.",
            data: [],
            pagination: { totalCount: 0, totalPages: 0, currentPage: page, pageSize },
            counts: { pending: 0, approved: 0, rejected: 0 },
        };
    }
};

export const getCertificateRequest = async (id: string) => {
    try {
        await requireAdmin();

        const request = await prisma.certificateRequest.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                course: { select: { id: true, title: true } },
                reviewedBy: { select: { name: true } },
                files: { orderBy: [{ attempt: "desc" }, { createdAt: "asc" }] },
            },
        });

        if (!request) return { success: false, message: "Request not found.", request: null };
        return { success: true, message: "Success", request };
    } catch (error) {
        console.log("Error fetching certificate request:", error);
        return { success: false, message: "Failed to load the request.", request: null };
    }
};

export const approveCertificateRequest = async (id: string, certificateName?: string) => {
    try {
        const admin = await requireAdmin();

        let name: string | undefined;
        if (certificateName !== undefined) {
            const nameError = validateCertificateName(certificateName);
            if (nameError) return { success: false, message: nameError };
            name = normalizeCertificateName(certificateName);
        }

        const now = new Date();
        // Only a pending request can be approved; once approved the name is permanent.
        const result = await prisma.certificateRequest.updateMany({
            where: { id, status: "pending" },
            data: {
                status: "approved",
                approvedAt: now,
                reviewedAt: now,
                reviewedById: admin.id,
                rejectionReason: null,
                ...(name ? { certificateName: name } : {}),
            },
        });

        if (result.count === 0) return { success: false, message: "This request is no longer pending. Please refresh." };

        await notifyStudent(id);
        return { success: true, message: "Certificate approved. The student can now download it." };
    } catch (error) {
        console.log("Error approving certificate request:", error);
        return { success: false, message: "Failed to approve the request. Please try again." };
    }
};

export const rejectCertificateRequest = async (id: string, reason: string, certificateName?: string) => {
    try {
        const admin = await requireAdmin();

        const trimmed = (reason ?? "").trim();
        if (trimmed.length < CERTIFICATE_LIMITS.reasonMin) return { success: false, message: "Please give the student a clear reason." };
        if (trimmed.length > CERTIFICATE_LIMITS.reasonMax) return { success: false, message: `Reason must be ${CERTIFICATE_LIMITS.reasonMax} characters or fewer.` };

        // An admin may also correct the name while rejecting (students never can).
        let name: string | undefined;
        if (certificateName !== undefined) {
            const nameError = validateCertificateName(certificateName);
            if (nameError) return { success: false, message: nameError };
            name = normalizeCertificateName(certificateName);
        }

        const result = await prisma.certificateRequest.updateMany({
            where: { id, status: "pending" },
            data: {
                status: "rejected",
                rejectionReason: trimmed,
                reviewedAt: new Date(),
                reviewedById: admin.id,
                ...(name ? { certificateName: name } : {}),
            },
        });

        if (result.count === 0) return { success: false, message: "This request is no longer pending. Please refresh." };

        await notifyStudent(id);
        return { success: true, message: "Request rejected. The student has been notified." };
    } catch (error) {
        console.log("Error rejecting certificate request:", error);
        return { success: false, message: "Failed to reject the request. Please try again." };
    }
};

// Best-effort email; a failure is logged but never undoes the review.
const notifyStudent = async (id: string) => {
    try {
        const request = await prisma.certificateRequest.findUnique({
            where: { id },
            select: {
                status: true,
                certificateName: true,
                rejectionReason: true,
                user: { select: { email: true, name: true } },
                course: { select: { title: true } },
            },
        });
        if (!request || request.status === "pending") return;

        const html = await render(CertificateStatusEmail({
            studentName: request.user.name || request.certificateName,
            courseName: request.course.title,
            status: request.status,
            reason: request.rejectionReason,
        }));

        const resend = new Resend(process.env.RESEND_API_KEY!);
        const { error } = await resend.emails.send({
            from: "Women Skills Hub <support@womenskillshub.com>",
            to: request.user.email,
            subject: request.status === "approved"
                ? "Your certificate is ready to download"
                : "Update on your certificate request",
            html,
        });
        if (error) console.log("Error sending certificate status email:", error);
    } catch (error) {
        console.log("Error sending certificate status email:", error);
    }
};
