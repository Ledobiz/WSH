import type { Metadata } from "next";
import Footer from "@/src/components/website/Footer";
import Hero from "@/src/components/website/Hero";
import Navbar from "@/src/components/website/Navbar";
import { Suspense } from "react";
import Loading from "@/src/components/website/loading";
import Homepage from "@/src/components/website/Homepage";

export const metadata: Metadata = {
    title: "Women Skills Hub - The home for upskilling for financial independence",
    description: "The home for upskilling for financial independence"
};

export default function Home() {
  	return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />

                <Hero />

                <Homepage />
                
                <Footer />
            </div>
        </Suspense>
  	);
}
