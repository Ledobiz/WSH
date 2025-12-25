import { NextResponse } from "next/server";
import { signVideoUrl } from "@/src/lib/bunny_token";

export async function POST(req: Request) {
    const { videoId } = await req.json();

    const signedVideoUrl = signVideoUrl(videoId);

    return NextResponse.json({
        playbackUrl: signedVideoUrl,
    });
}