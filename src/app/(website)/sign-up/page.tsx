import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { forgotPasswordUrl, loginUrl } from "@/src/utils/url";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Register - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const GetStarted = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const appName = process.env.NEXT_PUBLIC_APP_NAME;

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
                                            <h3 className="fw-semibold m-0">Hi! Welcome to</h3>
                                            <span>{ appName }</span>
                                        </div>
                                    </div>
                                    
                                    <div className="login-form">
                                        <form>
                                            <div className="social-login-wrap">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                                                    <a
                                                        href="#"
                                                        className="btn btn-md btn-gray rounded-3 border-2 flex-fill"
                                                    >
                                                        SignUp with
                                                        <i className="bi bi-google text-red ms-2" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="deider-wrap w-100 mt-4 mb-4">
                                                <div className="d-block border-top position-relative">
                                                    <span className="position-absolute top-50 start-50 translate-middle square--40 circle bg-white text-muted z-1">
                                                        OR
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3">
                                                <div className="row g-3">
                                                    <div className="form-group col-6">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="First Name"
                                                        />
                                                    </div>
                                                    <div className="form-group col-6">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Last Name"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email.."
                                                />
                                            </div>
                                            <div className="form-group mb-3">
                                                <div className="position-relative">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="********"
                                                    />
                                                    <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                                                        <i className="bi bi-eye text-muted" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3">
                                                <button type="button" className="btn btn-main w-100">
                                                    Sign Up
                                                </button>
                                            </div>

                                            <div className="form-group mb-3">
                                                <div className="text-center text-muted">
                                                    Already have an account?{" "}
                                                    <Link href={loginUrl}>
                                                        Log In
                                                    </Link>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
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
export default GetStarted