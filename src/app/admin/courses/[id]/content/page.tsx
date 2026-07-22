import AdminCourseContent from "@/src/pages/admin/AdminCourseContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Course Content - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <AdminCourseContent courseId={id} />
    );
}
