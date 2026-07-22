import AdminReviews from "@/src/pages/admin/AdminReviews";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reviews - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminReviews />
    )
}
export default page
