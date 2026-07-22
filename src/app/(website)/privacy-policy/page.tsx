import { Metadata } from "next"
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import PrivacyPolicy from "@/src/pages/website/PrivacyPolicy";

export const metadata: Metadata = {
    title: "Privacy Policy - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <PrivacyPolicy />
                <Footer />
            </div>
        </PageTransition>
    )
}

export default page