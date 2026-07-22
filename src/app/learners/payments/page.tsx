import PaymentPage from "@/src/views/learners/PaymentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payment History - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PaymentPage />
    )
}
export default page