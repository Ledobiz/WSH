import type { Metadata } from "next";
import { Suspense } from "react";
import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import ReviewsShowcase from "@/src/views/website/ReviewsShowcase";

export const metadata: Metadata = {
    title: "Student Reviews & Practicals - Women Skills Hub",
    description: "Read honest reviews and see real practical work from women who learned with Women Skills Hub."
};

function page() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <Suspense fallback={null}>
                    <ReviewsShowcase />
                </Suspense>
                <Footer />
            </div>
        </PageTransition>
    )
}
export default page
