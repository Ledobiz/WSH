import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import { Metadata } from "next"
import Footer from "@/src/components/website/Footer";
import AboutUs from "@/src/pages/website/AboutUs";

export const metadata: Metadata = {
    title: "About Us - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />

                <AboutUs />

                <Footer />
            </div>
        </PageTransition>
    )
}

export default page