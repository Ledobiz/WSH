import type { Metadata } from "next";
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Courses from "@/src/pages/website/Courses";
import Footer from "@/src/components/website/Footer";

export const metadata: Metadata = {
    title: "Courses - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

function page() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <Courses />
                <Footer />
            </div>
        </PageTransition>
    )
}
export default page