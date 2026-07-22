import Dashboard from "@/src/pages/learners/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Dashboard - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <Dashboard />
    )
}
export default page