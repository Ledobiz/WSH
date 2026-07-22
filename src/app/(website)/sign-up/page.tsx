import { Metadata } from "next"
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import SignupPage from "@/src/pages/website/SignupPage";

export const metadata: Metadata = {
    title: "Sign Up - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <SignupPage />
                <Footer />
            </div>
        </PageTransition>
    )
}
export default page