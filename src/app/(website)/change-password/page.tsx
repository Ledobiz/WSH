import Footer from "@/src/components/website/Footer";
import ChangePasswordForm from "@/src/components/website/ChangePasswordForm";
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Change Password - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const ChangePassword = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />

                <div className="bg-main position-relative">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-7 col-lg-9 col-md-12">
                                <div className="ht-300" />
                            </div>
                        </div>
                    </div>
                    <div className="position-absolute end-0 top-0">
                        <img
                            src={`${appUrl}/assets/img/log.png`}
                            className="img-fluid"
                            width={200}
                            alt="Log Screen"
                        />
                    </div>
                    <div className="position-absolute start-0 bottom-0">
                        <img
                            src={`${appUrl}/assets/img/log.png`}
                            className="img-fluid"
                            width={150}
                            alt="Log Screen"
                        />
                    </div>
                </div>

                <section className="pt-0">
                    <div className="container">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-xxl-6 col-xl-7 col-lg-9 col-md-12">
                                <div className="card border py-xl-5 p-4 login-card overlio overlios">
                                    <div className="web-logo d-flex align-items-center justify-content-center">
                                        <div className="logo">
                                            <img
                                                src={`${appUrl}/assets/img/wsh-logo-light.jpeg`}
                                                className="img-footer"
                                                alt="WSH-logo"
                                                style={{width: '80px', height: '100%'}}
                                            />
                                        </div>
                                    </div>

                                    <div className="login-caps mb-4">
                                        <div className="text-center">
                                            <h3 className="fw-semibold m-0">Set New Password</h3>
                                            <span>Complete this process to regain access to your account.</span>
                                        </div>
                                    </div>
                                    
                                    <ChangePasswordForm />
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
export default ChangePassword