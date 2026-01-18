import Footer from "@/src/components/website/Footer"
import HeroBanner from "@/src/components/website/HeroBanner"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Frequently Asked Questions - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const faq = () => {
    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Frequently Asked Questions" />

                <section>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-12 col-lg-12 col-12">
                                <div className="row g-4">
                                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                                        <div className="faq-group d-flex flex-column gap-3">
                                            <div className="single-group">
                                                <h4 className="text-dark">How do I access the online courses?</h4>
                                                <p className="text-muted">
                                                    Simply register your account on our Website/Learning Management System (LMS),
                                                    browse through our course catalog, select the course you wish to enroll in,
                                                    add the course to your cart, and proceed to checkout. Once your payment is confirmed,
                                                    you will gain immediate access to the course materials.
                                                </p>
                                            </div>
                                            
                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    Are the courses beginner-friendly?
                                                </h4>
                                                <p className="text-muted">
                                                    Yes! All courses are designed for beginners and intermediate learners, with step-by-step instructions and practical demonstrations.
                                                </p>
                                            </div>
                                            
                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    Can I get a refund if the course is not as advertised?
                                                </h4>
                                                <p className="text-muted">
                                                    Yes. A full refund will be granted if the course content is significantly different from the course outline or flyer and you request it within 48 hours of gaining access.
                                                </p>
                                            </div>

                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    Do I need special equipment?
                                                </h4>
                                                <p className="text-muted">
                                                    Basic kitchen tools or craft supplies are required depending on the course. A detailed list is provided in each course outline before you start.
                                                </p>
                                            </div>

                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    Are the courses suitable for business purposes?
                                                </h4>
                                                <p className="text-muted">
                                                    Yes. Many of our students start small bakeries, beverage businesses, or craft shops using the skills learned.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                                        <div className="faq-group d-flex flex-column gap-3">
                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    What courses are available?
                                                </h4>
                                                <p className="text-muted">
                                                    We offer three main categories: <br />
                                                    Baking & Culinary Arts: Cake recipes, commercial bread, yogurt parfait, pillow donuts, small chops, cake boxes & boards. <br />
                                                    Mixology & Beverage Arts: Mocktails, cocktails, Mixology Art. <br /> 
                                                    Paper Crafts & Creative Packaging: Gift boxes, cake boxes, small chops paper cups.
                                                </p>
                                            </div>
                                            
                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    Can I monetize the skills I learn?
                                                </h4>
                                                <p className="text-muted">
                                                    Absolutely! Our courses are practical and business-focused, with tips to start small businesses or side hustles.
                                                </p>
                                            </div>
                                            
                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    How long do I have access to my course?
                                                </h4>
                                                <p className="text-muted">
                                                    Students have lifetime access to their purchased courses, including updates and bonus materials.
                                                </p>
                                            </div>
                                            
                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    Can I learn at my own pace?
                                                </h4>
                                                <p className="text-muted">
                                                    Yes. All courses are fully online and self-paced, so you can fit learning around your schedule.
                                                </p>
                                            </div>
                                            
                                            <div className="single-group">
                                                <h4 className="text-dark">
                                                    How do I contact support?
                                                </h4>
                                                <p className="text-muted">
                                                    You can reach us via: <br />
                                                    Email: support@womenskillshub.com<br />
                                                    WhatsApp: +2349075144830<br />
                                                    
                                                    You can also use the floating whatsapp widget on the bottom-right side on your screen for quick assistance.
                                                </p>
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
export default faq