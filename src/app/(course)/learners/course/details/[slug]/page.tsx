import CourseLectureContent from "@/src/views/learners/CourseLecturePage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Course Details - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return (
        <Suspense fallback={null}>
            <CourseLectureContent courseId={slug} />
        </Suspense>
    );
}