import { NextResponse } from "next/server";
import { getUserFromSession } from "@/src/utils/jwt";
import { signVideoUrl } from "@/src/lib/bunny_token";

// Signs an arbitrary Bunny video id, so it is restricted to admins.
export async function POST(req: Request) {
    const user = await getUserFromSession();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId, libraryId } = await req.json().catch(() => ({}));
    if (typeof videoId !== "string" || !videoId) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    return NextResponse.json({
        playbackUrl: signVideoUrl(videoId, typeof libraryId === "string" ? libraryId : null),
    });
}
