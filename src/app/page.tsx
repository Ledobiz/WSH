import type { Metadata } from "next";

import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import Hero from "@/src/components/website/Hero";
import Homepage from "@/src/views/website/Homepage";


export const metadata: Metadata = {
    title: "Women Skills Hub - The home for upskilling for financial independence",
    description: "The home for upskilling for financial independence"
};

export default function Home() {
	return (
		<PageTransition>
			<div className="min-h-screen bg-background">
				<Navbar />
				<Hero />
				<Homepage />
				<Footer />
			</div>
		</PageTransition>
	);
}
