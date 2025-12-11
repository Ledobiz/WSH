import { Metadata } from "next";
import EarningPage from "@/src/components/admin/pages/EarningPage";

export const metadata: Metadata = {
    title: "Earnings - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Earnings = () => {
    return (
        <EarningPage />
    )
}
export default Earnings