'use client' 

import Footer from "@/src/components/website/Footer";
import HeroBanner from "@/src/components/website/HeroBanner";
import Loading from "@/src/components/website/loading";
import Navbar from "@/src/components/website/Navbar";
import { useCart } from "@/src/providers/CartProvider";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const Checkout = () => {
    const { cartCourses, isLoaded } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && cartCourses.length === 0) {
            router.push('/courses');
        }
    }, [isLoaded, cartCourses, router]);

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Cart" />

                <section>

                </section>

                <Footer />
            </div>
        </Suspense>
    )
}
export default Checkout