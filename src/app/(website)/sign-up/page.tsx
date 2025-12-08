import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import SignupForm from "@/src/components/website/SignupForm";
import { currentUser } from "@/src/utils/current_user";
import { adminDashboardUrl, loginUrl, studentDashboardUrl } from "@/src/utils/url";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Register - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const GetStarted = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const appName = process.env.NEXT_PUBLIC_APP_NAME;

    const user = await currentUser();
    
    if (user) {
        if (user.role == 'admin') {
            redirect(adminDashboardUrl);
        }

        redirect(studentDashboardUrl)
    }

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
        </Suspense>
    )
}
export default GetStarted