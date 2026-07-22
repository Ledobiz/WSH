import AdminCoupons from "@/src/pages/admin/AdminCoupons";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Coupons - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminCoupons />
    )
}
export default page
