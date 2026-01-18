import Footer from "@/src/components/website/Footer"
import HeroBanner from "@/src/components/website/HeroBanner"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { privacyPolicyUrl } from "@/src/utils/url"
import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Terms and Conditions - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Terms = () => {
    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Terms and Conditions" />

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 col-md-12">
                                <div className="prc_wrap">
                                    <p>Last Updated: 18 January 2026</p>
                                    <div className="prc_wrap_header">
                                        <h4 className="property_block_title">Our Terms and Conditions</h4>
                                    </div>
                                    <div className="prc_wrap-body">
                                        <p>
                                            Welcome to Women Skills Hub Limited. These Terms and Conditions govern your use of our website, online platforms, training programs, products, 
                                            and services. By accessing this website or enrolling in any of our programs, you agree to comply with and be bound by these Terms. If you do not agree, 
                                            please discontinue use of our Services.
                                        </p>
                                        <ul style={{listStyleType: 'number', paddingLeft: '20px'}}>
                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Company Information</li>
                                            <p>
                                                Women Skills Hub Limited is a skills development and training company focused on empowering women through online and physical trainings, digital products, coaching, and educational resources.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Acceptance of Terms</li>
                                            <p>
                                                By using this website or purchasing any course or service, you confirm that: <br />
                                                You are at least 18 years old or have consent from a parent or legal guardian.<br />
                                                You understand and accept these Terms in full.<br />
                                                You agree to use our Services lawfully and responsibly.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Use of Website</li>
                                            <p>
                                                You agree not to:<br />
                                                a) Violate any applicable laws or regulations.<br />
                                                b) Use the website for any illegal or unauthorized purpose.<br />
                                                c) Transmit harmful or malicious content.<br />
                                                d) Engage in any activity that disrupts or interferes with our Services. <br />
                                                e) Copy, modify, distribute, sell, or exploit any part of the website or its content without written permission. <br />
                                                f) Attempt to gain unauthorized access to our systems or networks. <br /><br />

                                                <em>We reserve the right to restrict or terminate access if misuse is detected.</em>
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Courses, Trainings, and Programs</li>
                                            <p>
                                                All training may be delivered online, physically, or through our website. Course outlines, duration, access period, and 
                                                delivery method will be clearly stated before enrollment. Enrollment grants you access for <strong>your personal use only</strong> and does not permit sharing or resale of materials
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Payments</li>
                                            <p>
                                                All prices are listed in Nigerian Naira (₦) unless stated otherwise. Full payment is required before access to any course, training, or digital product is granted.
                                                We reserve the right to change prices at any time without affecting already paid enrollments.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Refunds and Cancellations</li>
                                            <p>
                                                All payments made to Women Skills Hub Limited are final and non-refundable, unless otherwise stated in writing.
                                                No refunds will be issued for failure to attend classes, incomplete participation, or change of mind.
                                                Any exceptions will be considered strictly at the discretion of the organization.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Intellectual Property</li>
                                            <p>
                                                All content provided by Women Skills Hub Limited including videos, manuals, PDFs, graphics, logos, and training materials remains our intellectual property.<br />
                                                You may not: <br />
                                                a) Share paid materials with third parties.<br />
                                                b) Reproduce, duplicate, distribute, or create derivative works without written consent.<br />
                                                c) Use our trademarks or logos without permission.<br />
                                                d) Use our materials for commercial purposes without permission.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>User Conduct</li>
                                            <p>
                                                Participants and users must maintain respectful communication in all learning communities. Avoid posting harmful, abusive, or misleading information and 
                                                Follow all guidelines provided during trainings and within community groups. <br />
                                                Violation may result in removal without refund.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Disclaimer</li>
                                            <p>
                                                Our trainings are educational in nature. We do not guarantee income, business success, or specific results. 
                                                Outcomes depend on individual effort, skills, and external factors.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Limitation of Liability</li>
                                            <p>
                                                Women Skills Hub Limited shall not be liable for any loss, damage, or injury arising from the use of our website, trainings, or materials. Our liability, if any, shall not exceed the amount paid for the specific service.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Third-Party Platforms</li>
                                            <p>
                                                We may use third-party tools such as payment processors or communication platforms. We are not responsible for their policies, services, or downtime.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Privacy</li>
                                            <p>
                                                Your use of our website is also governed by our <Link href={privacyPolicyUrl}>Privacy Policy</Link>, which explains how we collect and use personal information.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Changes to These Terms</li>
                                            <p>
                                                We may update these Terms at any time. Continued use of our Services after changes are posted means you accept the revised Terms.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Governing Law</li>
                                            <p>
                                                These Terms shall be governed by the laws of the Federal Republic of Nigeria. Any disputes will be resolved in the courts of Lagos State, Nigeria.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Contact Us</li>
                                            <p>
                                                If you have any questions or concerns, please contact us at:
                                                <br />
                                                Women Skills Hub Limited<br />
                                                Email: <a href="mailto">support@womenskillshub.com</a> <br />
                                                Phone/Whatsapp: 09075144830 <br />
                                                Address: Alagbole, Ojodu, Lagos State, Nigeria
                                            </p>
                                        </ul>
                                        
                                        <br />
                                        By using our website and services, you agree to our terms and conditions above.
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
export default Terms