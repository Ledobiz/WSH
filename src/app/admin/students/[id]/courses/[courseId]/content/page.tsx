import AdminStudentCourseContent from "@/src/pages/admin/AdminStudentCourseContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Course Content - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default async function Page({ params }: { params: Promise<{ id: string; courseId: string }> }) {
    const { id, courseId } = await params;

    return (
        <AdminStudentCourseContent userId={id} courseId={courseId} />
    );
}
