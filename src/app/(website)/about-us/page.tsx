import Footer from "@/src/components/website/Footer"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { registerUrl } from "@/src/utils/url"
import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "About Us - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const AboutUs = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <section className="home-5" style={{paddingTop: '150px'}}>
                    <div className="container">
                        <div className="row align-items-center justify-content-center">
                            <div className="xol-xxl-7 col-xl-8 col-lg-10 col-md-12">
                                <div className="text-center d-block mb-4">
                                    <h1 className="display-2 fw-semibold page-title text-light">
                                        Hi, We're Women Skills Hub
                                    </h1>
                                    <p className="fs-5 text-light">
                                        Building confidence through skills
                                    </p>
                                </div>
                                <div className="d-flex align-items-center justify-content-center gap-3">
                                    <Link href={registerUrl} className="btn btn-main rounded-pill px-4">
                                        Get Enrolled
                                    </Link>
                                    <Link href={registerUrl} className="btn btn-gray rounded-pill px-4">
                                        Join Women Skills Hub
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="benifit-oflearning">
                                    <div className="d-block mb-4">
                                        <h2>Why WSH</h2>
                                        <p>
                                            Building a powerful and intuitive space for women who prioritise self development and financial independence.
                                        </p>
                                    </div>
                                    <div className="benifit-wraps mb-4">
                                        <div className="d-flex flex-column gap-4">
                                            <div className="d-flex align-items-center justify-content-start gap-3">
                                                <div className="icons">
                                                    <span className="square--50 circle bg-light-green fs-5">
                                                        <i className="bi bi-patch-check-fill text-green" />
                                                    </span>
                                                </div>
                                                <div className="caps">
                                                    <h5>100% online, flexible learning</h5>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex align-items-center justify-content-start gap-3">
                                                <div className="icons">
                                                    <span className="square--50 circle bg-light-green fs-5">
                                                        <i className="bi bi-patch-check-fill text-green" />
                                                    </span>
                                                </div>
                                                <div className="caps">
                                                    <h5>Hands-on, practical lessons</h5>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-start gap-3">
                                                <div className="icons">
                                                    <span className="square--50 circle bg-light-green fs-5">
                                                        <i className="bi bi-patch-check-fill text-green" />
                                                    </span>
                                                </div>
                                                <div className="caps">
                                                    <h5>Courses delivered as advertised</h5>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-start gap-3">
                                                <div className="icons">
                                                    <span className="square--50 circle bg-light-green fs-5">
                                                        <i className="bi bi-patch-check-fill text-green" />
                                                    </span>
                                                </div>
                                                <div className="caps">
                                                    <h5>Guidance on monetizing your skills</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <a href={registerUrl} className="btn btn-main rounded-pill px-5">
                                        Create an Account
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="facts-img">
                                    <img src={`${appUrl}/assets/img/hero-img-3.png`} className="img-fluid" alt="about-us-image" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 col-md-12 mt-4" style={{paddingTop: '30px'}}>
                                <h3 className="property_block_title">Women Skills Hub Limited (RC 7108779)</h3>
                                <p>
                                    Women Skills Hub Limited empowers women in Nigeria and beyond with practical, income-generating skills. Learn at your own pace through our online courses and turn your passion into profit.
                                </p>
                                <h5>Our Courses</h5>
                                <p>
                                    1. <strong>Baking & Culinary Arts</strong>: 
                                    Master cake recipes, commercial bread production, yogurt parfaits, pillow donuts, small chops, cake boxes, and cake boards. Perfect for home bakers or budding entrepreneurs.
                                </p>
                                <p>
                                    2. <strong>Mixology & Beverage Arts</strong>: 
                                    Learn mocktails, cocktails, and Mixology Art for events, personal use, or business ventures.
                                </p>
                                <p>
                                    3. <strong>Paper Crafts & Creative Packaging</strong>: 
                                    Create professional gift boxes, cake boxes, and small chops paper cups. Ideal for gifting or packaging your culinary creations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </Suspense>
    )
}
export default AboutUs