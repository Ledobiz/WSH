import AdminBlogForm from "@/src/views/admin/AdminBlogForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Post - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminBlogForm />
    )
}
export default page
