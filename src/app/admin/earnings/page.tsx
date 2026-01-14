import { Metadata } from "next";
import { Suspense } from "react";
import EarningPage from "@/src/components/admin/pages/EarningPage";
import PageLoader from "@/src/components/website/PageLoader";

export const metadata: Metadata = {
    title: "Earnings - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Earnings = () => {
    return (
        <Suspense fallback={<PageLoader />}> 
            <EarningPage />
        </Suspense>
    )
}
export default Earnings