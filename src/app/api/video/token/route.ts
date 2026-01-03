import { NextResponse } from "next/server";
import { getUserFromSession } from "@/src/utils/jwt";
import { fetchComponentById } from "@/src/services/admin/module_component";
import { signVideoUrl } from "@/src/lib/bunny_token";

export async function POST(req: Request) {
    const { videoId, isStudent } = await req.json();

    const user = await getUserFromSession();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await fetchComponentById(videoId, isStudent ? 'student' : 'admin');

    if (result.component?.type !== 'video') {
        return NextResponse.json({ error: "Bad request. Make sure the lecture is a video" }, { status: 400 });
    }

    /*let isEnrolled = false;

    if (user.role !== 'admin') { // Check for enrolment
        // TODO:: Check user is in enrolled table.
        isEnrolled = true;
    }
    else {
        isEnrolled = true;
    }

    if (!isEnrolled) {
        return NextResponse.json({ error: "Not enrolled for course" }, { status: 403 });
    }*/

    const signedVideoUrl = signVideoUrl(result.component?.vimeoVideoUrl);

    return NextResponse.json({
        playbackUrl: signedVideoUrl,
    });
}
