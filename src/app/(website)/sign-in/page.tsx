import { Metadata } from "next"
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import LoginPage from "@/src/pages/website/LoginPage";

export const metadata: Metadata = {
    title: "Sign In - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <LoginPage />
                <Footer />
            </div>
        </PageTransition>
    )
}
export default page