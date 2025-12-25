import type { Metadata } from "next";
import Navbar from "@/src/components/website/Navbar"
import HeroBanner from "@/src/components/website/HeroBanner";
import Footer from "@/src/components/website/Footer";
import { Suspense } from "react";
import Loading from "@/src/components/website/loading";
import CoursesPage from "@/src/components/website/CoursesPage";

export const metadata: Metadata = {
    title: "Courses - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Courses = () => {
    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Courses" />

                <CoursesPage />

                <Footer />
            </div>
        </Suspense>
    )
}
export default Courses