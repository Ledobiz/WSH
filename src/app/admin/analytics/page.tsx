import AdminAnalytics from "@/src/pages/admin/AdminAnalytics";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminAnalytics />
    )
}
export default page
