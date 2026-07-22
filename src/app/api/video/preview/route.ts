import { NextResponse } from "next/server";
import { signVideoUrl } from "@/src/lib/bunny_token";

export async function POST(req: Request) {
    const { videoId, libraryId } = await req.json();

    const signedVideoUrl = signVideoUrl(videoId, libraryId ?? null);

    return NextResponse.json({
        playbackUrl: signedVideoUrl,
    });
}