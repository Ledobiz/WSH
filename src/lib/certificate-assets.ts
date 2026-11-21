import { randomUUID } from "crypto";
import cloudinary from "@/src/lib/cloudinary";
import { CERTIFICATE_LIMITS, UploadedAsset } from "@/src/utils/certificate";

// Server-only helpers for direct browser -> Cloudinary uploads of certificate
// practicals and signatures. Files never pass through our server (Vercel caps
// request bodies at ~4.5 MB); instead the server signs each upload with a
// public_id it chooses, and later verifies Cloudinary's response signature.

export type CertificateAssetKind = "practicals" | "signatures";

export interface SignedUpload {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    publicId: string;
    signature: string;
}

const prefixFor = (userId: string, kind: CertificateAssetKind) => `wsh/certificates/${userId}/${kind}/`;

// Present in the Cloudinary SDK at runtime (lib/utils) but missing from its typings.
const verifyResponseSignature = (publicId: string, version: number, signature: string): boolean =>
    (cloudinary.utils as unknown as {
        verify_api_response_signature: (publicId: string, version: number, signature: string) => boolean;
    }).verify_api_response_signature(publicId, version, signature);

export const signCertificateUploads = (userId: string, kind: CertificateAssetKind, count: number): SignedUpload[] => {
    const { cloud_name, api_key, api_secret } = cloudinary.config();
    if (!cloud_name || !api_key || !api_secret) throw new Error("Cloudinary is not configured");

    const timestamp = Math.round(Date.now() / 1000);
    return Array.from({ length: count }, () => {
        const publicId = `${prefixFor(userId, kind)}${randomUUID()}`;
        const signature = cloudinary.utils.api_sign_request({ public_id: publicId, timestamp }, api_secret);
        return { cloudName: cloud_name, apiKey: api_key, timestamp, publicId, signature };
    });
};

/**
 * Returns an error message if the asset is not a genuine upload to our Cloudinary
 * account, under this user's folder, within size limits — otherwise null.
 */
export const verifyCertificateAsset = (
    asset: UploadedAsset,
    userId: string,
    kind: CertificateAssetKind,
): string | null => {
    const { cloud_name } = cloudinary.config();

    if (!asset || typeof asset.publicId !== "string" || typeof asset.signature !== "string") return "Invalid file.";
    if (!asset.publicId.startsWith(prefixFor(userId, kind))) return "Invalid file.";

    const genuine = verifyResponseSignature(asset.publicId, Number(asset.version), asset.signature);
    if (!genuine) return "One of the files could not be verified. Please upload it again.";

    const allowedTypes = kind === "signatures" ? ["image"] : ["image", "video"];
    if (!allowedTypes.includes(asset.resourceType)) return "Unsupported file type.";

    const expectedUrlPrefix = `https://res.cloudinary.com/${cloud_name}/${asset.resourceType}/upload/v${asset.version}/${asset.publicId}`;
    if (typeof asset.secureUrl !== "string" || !asset.secureUrl.startsWith(expectedUrlPrefix)) return "Invalid file.";

    const limit = asset.resourceType === "video" ? CERTIFICATE_LIMITS.maxVideoBytes : CERTIFICATE_LIMITS.maxImageBytes;
    if (Number(asset.bytes) > limit) return "One of the files is larger than allowed.";

    return null;
};

// Only fetch from our own Cloudinary account (defence against SSRF via stored URLs).
export const isOwnCloudinaryUrl = (url: string) => {
    const { cloud_name } = cloudinary.config();
    return typeof url === "string" && url.startsWith(`https://res.cloudinary.com/${cloud_name}/`);
};
