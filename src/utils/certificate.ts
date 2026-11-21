// Shared certificate rules, wording and layout — used by the server actions, the
// PDF builder (src/lib/certificate-pdf.ts) and the in-browser preview so they can
// never drift apart.

export const CERTIFICATE_LIMITS = {
    maxFiles: 20,
    maxImageBytes: 10 * 1024 * 1024, // 10 MB
    maxVideoBytes: 100 * 1024 * 1024, // 100 MB
    nameMin: 2,
    nameMax: 80,
    reasonMin: 5,
    reasonMax: 1000,
};

export const ACCEPTED_PRACTICAL_TYPES = "image/*,video/*";

export type CertificateStatus = "pending" | "approved" | "rejected";

// What the browser sends back after a direct upload to Cloudinary. The server
// verifies `signature` (Cloudinary's response signature) before trusting it.
export interface UploadedAsset {
    publicId: string;
    version: number;
    signature: string;
    resourceType: "image" | "video";
    secureUrl: string;
    bytes: number;
    format?: string;
}

export const normalizeCertificateName = (value: string) => value.trim().replace(/\s+/g, " ");

// Letters (any language), spaces, apostrophes, hyphens and full stops.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} '’.\-]*$/u;

export const validateCertificateName = (raw: string): string | null => {
    const name = normalizeCertificateName(raw);
    if (name.length < CERTIFICATE_LIMITS.nameMin) return "Please enter your full name.";
    if (name.length > CERTIFICATE_LIMITS.nameMax) return `Name must be ${CERTIFICATE_LIMITS.nameMax} characters or fewer.`;
    if (!NAME_PATTERN.test(name)) return "Name can only contain letters, spaces, apostrophes, hyphens and full stops.";
    return null;
};

const titleCase = (value: string) =>
    value.toLowerCase().replace(/(^|[\s(\-/])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());

export const formatCertificateDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Lagos", month: "long", day: "numeric", year: "numeric" })
        .format(date)
        .toUpperCase();

export const certificateSentence = (courseTitle: string) =>
    `Has Successfully Completed The Online ${titleCase(courseTitle.trim())} Class And Has Satisfactorily Met The Requirements For This Certificate.`;

// Template page size (A4 landscape) and text positions, in PDF points with the
// origin at the bottom-left — measured from src/assets/certificate/template.pdf.
export const CERTIFICATE_PAGE = { width: 841.89, height: 595.28 };

export const CERTIFICATE_LAYOUT = {
    pageCenterX: 420.9,
    name: { baselineY: 306, maxSize: 55, minSize: 26, maxWidth: 610 },
    date: { centerX: 418.7, centerY: 268.4, size: 19, maxWidth: 196 },
    body: { firstBaselineY: 202, lineHeight: 21.5, size: 18, minSize: 12, maxWidth: 615, maxLines: 3 },
    studentLine: { centerX: 663.6, y: 101, width: 172 },
    signature: { maxWidth: 160, maxHeight: 54, gapAboveLine: 3 },
    studentName: { centerX: 630, baselineY: 79, size: 18, minSize: 9, maxWidth: 280 },
};

export const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
};
