import { Metadata } from "next"
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import Faq from "@/src/views/website/Faq";

export const metadata: Metadata = {
    title: "Frequently Asked Questions - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <Faq />
                <Footer />
            </div>
        </PageTransition>
    )
}
export default page