import AdminBlogForm from "@/src/views/admin/AdminBlogForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Post - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <AdminBlogForm postId={id} />
    );
}
