'use client'

import Link from "next/link"
import LoginForm from "./LoginForm"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useAuth } from "@/src/providers/AuthProvider"
import { registerUrl } from "@/src/utils/url"
import PageLoader from "./PageLoader"

const LoginPage = () => {
    const { loading } = useAuth();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

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
                                <div className="web-logo d-flex align-items-center justify-content-center mb-3">
                                    <div className="logo">
                                        <img
                                            src={`${appUrl}/assets/img/logo-icon.png`}
                                            className="img-fluid"
                                            width={60}
                                            alt="Logo"
                                        />
                                    </div>
                                </div>
                                
                                <div className="login-caps mb-4">
                                    <div className="text-center">
                                        <h3 className="fw-semibold m-0">Welcome back</h3>
                                        <span>Please enter your details to sign in carefully.</span>
                                    </div>
                                </div>
                                
                                <div className="login-form">                                        
                                    <LoginForm />

                                    <div className="form-group">
                                        <div className="text-center text-muted">
                                            Don't have an account yet?{" "}
                                            <Link href={registerUrl}>
                                                Sign Up
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
export default LoginPage