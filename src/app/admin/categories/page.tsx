import AdminCategories from "@/src/views/admin/AdminCategories";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminCategories />
    )
}
export default page
