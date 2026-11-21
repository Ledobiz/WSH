import crypto from 'crypto';

export function signVideoUrl(
    videoId: string | null,
    libraryIdOverride?: string | null,
    expirationTime = 300,
): string {
    const securityKey = process.env.BUNNY_PLAYER_SECRET_KEY!;
    // Per-lesson Bunny folder/library override; falls back to the default library.
    // The signing token depends only on the (shared) security key + video id + expiry,
    // so a single key works across libraries and existing videos remain backward compatible.
    const libraryId = libraryIdOverride?.trim() || process.env.BUNNY_VIDEO_LIBRARY_ID!;
    const baseUrl = process.env.BUNNY_VIDEO_BASE_URL!;

    if (!libraryId || !securityKey) {
        throw new Error("Missing Bunny Stream environment variables.");
    }

    if (!videoId) {
        throw new Error('Missing video ID');
    }

    // 1. Calculate expiration (Current Unix Timestamp + Seconds)
    const expires = Math.floor(Date.now() / 1000) + expirationTime;

    // 2. Create the hashable string
    const hashableBase = securityKey + videoId + expires;

    // 3. Generate SHA256 Hex Hash
    const token = crypto
        .createHash('sha256')
        .update(hashableBase)
        .digest('hex');

    // 4. Return the full Embed URL
    return `${baseUrl}/${libraryId}/${videoId}?token=${token}&expires=${expires}`;
}

const BUNNY_VIDEO_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Turns a course's stored preview value into something an <iframe> can play.
 * - A Bunny video id is signed (server-side only) so the embed is authorised.
 * - A full https:// URL (e.g. a pasted embed link) is used as-is.
 * - Anything else returns null so the page hides the preview instead of
 *   loading a broken relative URL.
 */
export function resolvePreviewVideoUrl(value?: string | null): string | null {
    const raw = value?.trim();
    if (!raw) return null;
    if (/^https:\/\//i.test(raw)) return raw;
    if (!BUNNY_VIDEO_ID.test(raw)) return null;
    try {
        // Long enough for a visitor to watch after the page loads; re-signed on every visit.
        return signVideoUrl(raw, null, 6 * 60 * 60);
    } catch (error) {
        console.log("Unable to sign preview video:", error);
        return null;
    }
}
