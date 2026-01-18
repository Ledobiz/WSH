import Footer from "@/src/components/website/Footer"
import HeroBanner from "@/src/components/website/HeroBanner"
import Loading from "@/src/components/website/loading"
import Navbar from "@/src/components/website/Navbar"
import { Metadata } from "next"
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
                                    <div className="prc_wrap_header">
                                        <h4 className="property_block_title">Our Terms and Conditions</h4>
                                    </div>
                                    <div className="prc_wrap-body">
                                        <p>
                                            Women Skills Hub Limited is committed to protecting your privacy. 
                                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. 
                                            <br />
                                            Please read this policy carefully.
                                        </p>
                                        <ul style={{listStyleType: 'number', paddingLeft: '20px'}}>
                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Information We Collect</li>
                                            <p>
                                                We may collect information about you in the following ways:
                                                <ul style={{listStyleType: 'lower-alpha', paddingLeft: '20px'}}>
                                                    <li style={{fontSize: '16px', fontWeight: 'bold', marginTop: '10px'}}>Personal Information</li>
                                                    Information you voluntarily provide to us, including but not limited to:<br />
                                                    Full Name <br />
                                                    Email Address <br />
                                                    Phone Number <br />
                                                    Address <br />
                                                    Any other information you submit through forms, registrations, or communication with us

                                                    <li style={{fontSize: '16px', fontWeight: 'bold', marginTop: '10px'}}>Non-Personal Information</li>
                                                    Information collected automatically when you visit our website, such as:<br />
                                                    IP Address <br />
                                                    Browser Type <br />
                                                    Device Information <br />
                                                    Pages visited and time spent on the website www.womenskillshub.com
                                                </ul>
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>How We Use Your Information</li>
                                            <p>
                                                We use the information we collect to:
                                                Provide, operate, and improve our services. <br />
                                                Process registrations, payments, and transactions<br />
                                                Communicate with you, including responding to inquiries and sending updates <br />
                                                Send promotional materials, newsletters, or offers (you may opt out at any time) <br />
                                                Monitor and analyze website usage and trends <br />
                                                Comply with legal obligations
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Sharing of Your Information</li>
                                            <p>
                                                We do not sell or rent your personal information. We may share your information only in the following situations:<br />
                                                With trusted service providers who assist us in operating our website or services. To comply with legal requirements, court orders, or lawful requests
                                                To protect our rights, privacy, safety, or property, and that of our users or the public. In connection with a business transfer, merger, or acquisition
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Cookies and Tracking Technologies</li>
                                            <p>
                                                We may use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us understand user behavior
                                                 and improve our services. You can choose to disable cookies through your browser settings, but this may affect website functionality.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Data Security</li>
                                            <p>
                                                We implement reasonable administrative, technical, and physical security measures to protect your personal information. 
                                                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Your Rights</li>
                                            <p>
                                                You have the right to access, correct, or delete your personal information. 
                                                You may also have the right to object to or restrict certain processing of your data. <br />
                                                To exercise these rights, please contact us using the information provided below.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Changes to This Privacy Policy</li>
                                            <p>
                                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. 
                                                You are advised to review this policy periodically for any updates.
                                            </p>

                                            <li style={{fontSize: '18px', fontWeight: 'bold'}}>Contact Us</li>
                                            <p>
                                                If you have any questions or concerns about this Privacy Policy, please contact us at:
                                                <br />
                                                Women Skills Hub Limited<br />
                                                Email: <a href="mailto">support@womenskillshub.com</a> <br />
                                                Phone/Whatsapp: 09075144830 <br />
                                                Address: Alagbole, Ojodu, Lagos State, Nigeria
                                            </p>
                                        </ul>
                                        
                                        <br />
                                        By using our website and services, you agree to the terms of this Privacy Policy.
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