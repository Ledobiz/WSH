import { Metadata } from "next";
import ReviewsPage from "@/src/components/admin/pages/ReviewsPage";
import { Suspense } from "react";
import PageLoader from "@/src/components/website/PageLoader";

export const metadata: Metadata = {
    title: "Reviews - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Reviews = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <ReviewsPage />
        </Suspense>
    )
}
export default Reviews