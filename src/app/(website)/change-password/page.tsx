import { Metadata } from "next"
import { Suspense } from "react";
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import ChangePassword from "@/src/pages/website/ChangePassword";

export const metadata: Metadata = {
    title: "Reset Password - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <Suspense fallback={null}>
                    <ChangePassword />
                </Suspense>
                <Footer />
            </div>
        </PageTransition>
    )
}

export default page
