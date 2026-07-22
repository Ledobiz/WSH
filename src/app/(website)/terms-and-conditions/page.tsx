import { Metadata } from "next"
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import TermsAndConditions from "@/src/views/website/TermsAndConditions";

export const metadata: Metadata = {
    title: "Terms and Conditions - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <TermsAndConditions />
                <Footer />
            </div>
        </PageTransition>
    )
}

export default page
