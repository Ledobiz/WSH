import Footer from "@/src/components/website/Footer"
import HeroBanner from "@/src/components/website/HeroBanner"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Refund Policy - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const RefundPolicy = () => {
    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Refund Policy" />

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 col-md-12">
                                <div className="prc_wrap">
                                    <div className="prc_wrap_header">
                                        <h4 className="property_block_title">Refund Policy</h4>
                                    </div>
                                    <div className="prc_wrap-body">
                                        <p>
                                           At Women Skills Hub, all our online courses are delivered through our official website. By enrolling in any course, you agree to the refund terms below.
                                        </p>
                                        <ul style={{listStyleType: 'number', paddingLeft: '20px'}}>
                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Access to Online Courses</li>
                                            <p>
                                                Once payment is completed, students are granted immediate access to course content on our website, including:<br />
                                                Pre-recorded video lessons<br />
                                                Downloadable materials<br />
                                                Course resources and bonuses <br />

                                                <em style={{color: 'red'}}>
                                                    Due to the digital nature of our courses, all payments are non-refundable once access has been granted, except as stated in Section 2 below.
                                                </em>
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Refund Guarantee – Course Not as Advertised</li>
                                            <p>
                                                A full refund will be granted ONLY
                                                <strong>
                                                    if the content delivered is significantly different from what was stated in the official course outline, sales page, or promotional flyer
                                                    and the refund request is made within 48 hours of gaining course access
                                                </strong>
                                                <br />
                                                Each request will be reviewed fairly, and if confirmed, a refund will be issued.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>No Refunds Will Be Issued For</li>
                                            <p>
                                                Change of mind after purchase, Failure to complete the course, Internet, device, or technical issues on the student’s end and 
                                                Lack of results where the course content matches what was advertised.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>How to Request a Refund</li>
                                            <p>
                                                Refund requests must be submitted within 48 hours of course access and should include:<br />
                                                Full name used during enrollment<br />
                                                Course Purchased<br />
                                                Proof of purchase (transaction ID, receipt)<br />
                                                Reason for the refund request<br />
                                                Your email address<br />
                                                Your whatsapp number<br />
                                                All refund requests should be sent to: <a href="mailto:support@womenskillshub.com">support@womenskillshub.com</a>
                                                with the subject line "Refund Request - [Course Name]".
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Refund Processing Timeline</li>
                                            <p>
                                                Approved refunds will be processed within 7–14 business days, depending on the payment method used.
                                            </p>
                                        </ul>
                                        
                                        <br />
                                        By using our website and services, you agree to the terms of this Refund Policy.
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
export default RefundPolicy