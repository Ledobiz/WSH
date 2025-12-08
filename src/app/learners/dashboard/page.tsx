import DashboardPage from "@/src/components/dashboard/pages/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Dashboard - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Dashboard = () => {
    return (
        <DashboardPage />
    )
}
export default Dashboard