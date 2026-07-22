import AdminStudents from "@/src/pages/admin/AdminStudents";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Students - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminStudents />
    )
}
export default page
