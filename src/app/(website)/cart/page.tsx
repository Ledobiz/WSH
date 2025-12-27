import CartPage from "@/src/components/website/CartPage"
import Footer from "@/src/components/website/Footer"
import HeroBanner from "@/src/components/website/HeroBanner"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Cart - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Cart = () => {
    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Cart" />

                <CartPage />

                <Footer />
            </div>
        </Suspense>
    )
}
export default Cart