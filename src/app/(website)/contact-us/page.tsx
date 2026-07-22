import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import { Metadata } from "next"
import Footer from "@/src/components/website/Footer";
import ContactUs from "@/src/pages/website/ContactUs";

export const metadata: Metadata = {
    title: "Contact Us - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />

                <ContactUs />

                <Footer />
            </div>
        </PageTransition>
    )
}
export default page