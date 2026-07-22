import AdminFinances from "@/src/pages/admin/AdminFinances";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Finances - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminFinances />
    )
}
export default page
