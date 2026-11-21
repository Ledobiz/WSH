import { NextResponse } from "next/server";
import { getUserFromSession } from "@/src/utils/jwt";
import prisma from "@/src/lib/prisma";
import { signVideoUrl } from "@/src/lib/bunny_token";

type VideoSource = { type: string; vimeoVideoUrl: string | null; bunnyLibraryId: string | null };

export async function POST(req: Request) {
    const user = await getUserFromSession();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId, isStudent } = await req.json().catch(() => ({}));
    if (typeof videoId !== "string" || !videoId) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const select = { type: true, vimeoVideoUrl: true, bunnyLibraryId: true } as const;
    let component: VideoSource | null = null;

    if (user.role === "admin") {
        // Admins can play both course templates and a student's copy.
        component = isStudent
            ? await prisma.studentModuleComponent.findUnique({ where: { id: videoId }, select })
            : await prisma.moduleComponent.findUnique({ where: { id: videoId }, select });
    } else {
        // Students only get lectures from their own active enrollment. The role
        // comes from the session, never from the request body.
        component = await prisma.studentModuleComponent.findFirst({
            where: {
                id: videoId,
                deletedAt: null,
                student: { userId: user.id, deletedAt: null },
            },
            select,
        });
    }

    if (!component) {
        return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }
    if (component.type !== "video") {
        return NextResponse.json({ error: "Bad request. Make sure the lecture is a video" }, { status: 400 });
    }

    return NextResponse.json({
        playbackUrl: signVideoUrl(component.vimeoVideoUrl, component.bunnyLibraryId),
    });
}
