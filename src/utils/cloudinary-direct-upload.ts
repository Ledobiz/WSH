// Browser-side signed upload straight to Cloudinary (bypasses our server, so large
// videos aren't limited by Vercel's request-size cap). The signature and public_id
// come from a server action; the response is verified again on submit.

import type { SignedUpload } from "@/src/lib/certificate-assets";
import type { UploadedAsset } from "@/src/utils/certificate";

export const uploadSignedFile = (
    file: Blob,
    signed: SignedUpload,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
): Promise<UploadedAsset> =>
    new Promise((resolve, reject) => {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", signed.apiKey);
        form.append("timestamp", String(signed.timestamp));
        form.append("public_id", signed.publicId);
        form.append("signature", signed.signature);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) onProgress(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onload = () => {
            try {
                const body = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({
                        publicId: body.public_id,
                        version: body.version,
                        signature: body.signature,
                        resourceType: body.resource_type,
                        secureUrl: body.secure_url,
                        bytes: body.bytes,
                        format: body.format,
                    });
                } else {
                    reject(new Error(body?.error?.message || "Upload failed"));
                }
            } catch {
                reject(new Error("Upload failed"));
            }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));

        signal?.addEventListener("abort", () => xhr.abort(), { once: true });
        xhr.send(form);
    });
