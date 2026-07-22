'use client'

import PageTransition from "@/src/components/PageTransition"
import Footer from "@/src/components/website/Footer"
import Navbar from "@/src/components/website/Navbar"
import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('@/src/views/website/CartPage'), { ssr: false });

const page = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />

                <CartPage />

                <Footer />
            </div>
        </PageTransition>
    )
}
export default page