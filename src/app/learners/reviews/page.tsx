import ReviewsPage from "@/src/views/learners/ReviewsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Reviews - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <ReviewsPage />
    )
}
export default page
