'use client' 

import Footer from "@/src/components/website/Footer";
import HeroBanner from "@/src/components/website/HeroBanner";
import Loading from "@/src/components/website/loading";
import Navbar from "@/src/components/website/Navbar";
import { studentDashboardUrl } from "@/src/utils/url";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const Checkout = () => {
    const router = useRouter();

    useEffect(() => {
        const paymentsDone = localStorage.getItem('payments-done');
        if (!paymentsDone || paymentsDone !== 'yes') {
            router.push('/');
        } else {
            localStorage.removeItem('payments-done');
        }
    }, []);

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Payment Successful" />

                <section>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-6 col-lg-6 col-md-12 mx-auto">
                                <div className="thankyou-wrap text-center">
                                    <div className="square--90 circle bg-green text-light mx-auto mb-4">
                                        <i className="bi bi-patch-check-fill fs-1" />
                                    </div>
                                    <h2 className="text-dark">
                                        Thank you for your order
                                    </h2>
                                    <p>
                                        We appreciate your patronage and promise you a seamless and engaging learning experience.<br />
                                        Simply click the button below to go to your dashboard to access your courses and start learning right away!
                                    </p>
                                    <Link href={studentDashboardUrl} className="btn btn-main mt-4 mb-5">
                                        Go to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </Suspense>
    )
}
export default Checkout