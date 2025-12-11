import { Metadata } from "next";
import ReviewsPage from "@/src/components/admin/pages/ReviewsPage";

export const metadata: Metadata = {
    title: "Reviews - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Reviews = () => {
    return (
        <ReviewsPage />
    )
}
export default Reviews