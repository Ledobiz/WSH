import AdminBlog from "@/src/views/admin/AdminBlog";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminBlog />
    )
}
export default page
