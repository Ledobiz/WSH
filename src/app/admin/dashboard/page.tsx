import { Metadata } from "next";
import AdminDashboard from "@/src/components/admin/pages/AdminDashboard"

export const metadata: Metadata = {
    title: "Admin Dashboard - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Dashboard = () => {
    return (
        <AdminDashboard />
    )
}
export default Dashboard