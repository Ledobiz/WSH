import Loading from "@/src/components/website/loading"
import SignupPage from "@/src/components/website/SignupPage";
import { Metadata } from "next";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Register - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const GetStarted = async () => {
    return (
        <Suspense fallback={<Loading />}>
            <SignupPage />
        </Suspense>
    )
}
export default GetStarted