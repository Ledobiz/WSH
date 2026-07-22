import CourseLectureContent from "@/src/pages/learners/CourseLecturePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Course Details - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return <CourseLectureContent courseId={slug} />;
}