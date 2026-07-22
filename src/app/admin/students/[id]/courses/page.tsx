import AdminStudentCourses from "@/src/pages/admin/AdminStudentCourses";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Courses - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <AdminStudentCourses userId={id} />
    );
}
