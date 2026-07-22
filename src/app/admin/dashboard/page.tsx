import AdminDashboard from "@/src/views/admin/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminDashboard />
    )
}
export default page
