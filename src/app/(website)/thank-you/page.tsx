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
        if (!paymentsDone || paymentsDone !== 'true') {
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
                            <div className="col-xl-7 col-lg-8 col-md-12">
                                <div className="thankyou-wrap text-center">
                                    <div className="square--90 circle bg-green text-light mx-auto mb-4">
                                        <i className="bi bi-patch-check-fill fs-1" />
                                    </div>
                                    <h2 className="text-dark">
                                        Course submission completed successfully.
                                    </h2>
                                    <p>
                                        Thank you for submitting your item. We will review it shortly and
                                        notify you by email once your course has been accepted. Please
                                        ensure that your{" "}
                                        <a href="#" className="text-main">
                                        Payment and Tax information
                                        </a>{" "}
                                        is accurate and up to date.
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