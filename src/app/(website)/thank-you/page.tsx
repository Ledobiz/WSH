import type { Metadata } from "next";
import PageTransition from "@/src/components/PageTransition"
import Footer from "@/src/components/website/Footer"
import Navbar from "@/src/components/website/Navbar"
import ThankYou from "@/src/pages/website/ThankYou"

export const metadata: Metadata = {
    title: "Thank You - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />

                <ThankYou />

                <Footer />
            </div>
        </PageTransition>
    )
}
export default page