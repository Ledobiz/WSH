'use client';

import { useEffect } from "react";
import Footer from "./Footer"
import Navbar from "./Navbar"
import PageLoader from "./PageLoader";
import { useAuth } from "@/src/providers/AuthProvider";
import { loginUrl } from "@/src/utils/url";
import SignupForm from "./SignupForm";
import Link from "next/link";

const SignupPage = () => {    
    const { loading } = useAuth();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const appName = process.env.NEXT_PUBLIC_APP_NAME;

    if (loading) {
        return <PageLoader />;
    }

    return (
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
                                        <h3 className="fw-semibold m-0">Hi! Welcome to</h3>
                                        <span>{ appName }</span>
                                    </div>
                                </div>
                                
                                <div className="login-form">
                                    <SignupForm />

                                    <div className="form-group mb-3">
                                        <div className="text-center text-muted">
                                            Already have an account?{" "}
                                            <Link href={loginUrl}>
                                                Log In
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
export default SignupPage