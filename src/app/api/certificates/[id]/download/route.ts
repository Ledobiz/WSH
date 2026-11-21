import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getUserFromSession } from "@/src/utils/jwt";
import { buildCertificatePdf } from "@/src/lib/certificate-pdf";
import { isOwnCloudinaryUrl } from "@/src/lib/certificate-assets";
import { normalizeCertificateName, validateCertificateName } from "@/src/utils/certificate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fileSafe = (value: string) =>
    value.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "certificate";

/**
 * GET /api/certificates/:id/download
 *  - Students: only their own request, and only once approved. The printed name is
 *    always the locked `certificateName` from the database.
 *  - Admins: any request in any status (preview before approving). `?name=` lets the
 *    admin preview an edited name; `?inline=1` opens it in the browser.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ message: "Please sign in." }, { status: 401 });

        const { id } = await params;
        const certificate = await prisma.certificateRequest.findUnique({
            where: { id },
            select: {
                userId: true,
                status: true,
                certificateName: true,
                signatureUrl: true,
                approvedAt: true,
                course: { select: { title: true } },
            },
        });

        const isAdmin = user.role === "admin";
        const isOwnerApproved = certificate?.userId === user.id && certificate.status === "approved";

        // 404 rather than 403 so request ids can't be probed.
        if (!certificate || (!isAdmin && !isOwnerApproved)) {
            return NextResponse.json({ message: "Certificate not found." }, { status: 404 });
        }

        let name = certificate.certificateName;
        const previewName = request.nextUrl.searchParams.get("name");
        if (isAdmin && previewName) {
            const error = validateCertificateName(previewName);
            if (error) return NextResponse.json({ message: error }, { status: 400 });
            name = normalizeCertificateName(previewName);
        }

        let signature: Uint8Array | null = null;
        if (certificate.signatureUrl && isOwnCloudinaryUrl(certificate.signatureUrl)) {
            const res = await fetch(certificate.signatureUrl, { cache: "no-store" });
            if (res.ok) signature = new Uint8Array(await res.arrayBuffer());
            else console.warn("Certificate download: could not fetch signature", res.status);
        }

        const pdf = await buildCertificatePdf({
            name,
            courseTitle: certificate.course.title,
            date: certificate.approvedAt ?? new Date(), // previews of unapproved requests use today
            signature,
        });

        const inline = isAdmin && request.nextUrl.searchParams.get("inline") === "1";
        const filename = `WSH-Certificate-${fileSafe(certificate.course.title)}-${fileSafe(name)}.pdf`;

        return new NextResponse(Buffer.from(pdf), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
                "Cache-Control": "private, no-store",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        console.error("Certificate download error:", error);
        return NextResponse.json({ message: "Could not generate the certificate. Please try again." }, { status: 500 });
    }
}
