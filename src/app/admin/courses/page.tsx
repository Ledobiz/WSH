import AdminCourses from "@/src/views/admin/AdminCourses";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminCourses />
    )
}
export default page
