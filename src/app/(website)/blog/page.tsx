import { Metadata } from "next"
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import Blog from "@/src/pages/website/Blog";

export const metadata: Metadata = {
    title: "Blog - Women Skills Hub",
    description: "Practical advice, success stories, and resources to help you build skills and grow your business."
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <Blog />
                <Footer />
            </div>
        </PageTransition>
    )
}

export default page
