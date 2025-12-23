import crypto from 'crypto';

export function signVideoUrl(
    videoId: string | null,
    expirationTime = 300,
): string {
    const securityKey = process.env.BUNNY_PLAYER_SECRET_KEY!;
    const libraryId = process.env.BUNNY_VIDEO_LIBRARY_ID!;
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