import Loading from "@/src/components/website/loading"
import LoginPage from "@/src/components/website/LoginPage";
import { Metadata } from "next";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Sign In - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const SignIn = async () => {
    return (
        <Suspense fallback={<Loading />}>
            <LoginPage />
        </Suspense>
    )
}
export default SignIn