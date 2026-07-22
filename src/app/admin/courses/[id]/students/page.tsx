import AdminCourseStudents from "@/src/views/admin/AdminCourseStudents";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Course Students - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <AdminCourseStudents courseId={id} />
    );
}
