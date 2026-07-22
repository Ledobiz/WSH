import { Metadata } from "next"
import { Suspense } from "react";
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import SignupPage from "@/src/views/website/SignupPage";

export const metadata: Metadata = {
    title: "Sign Up - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <Suspense fallback={null}>
                    <SignupPage />
                </Suspense>
                <Footer />
            </div>
        </PageTransition>
    )
}
export default page