import { cartUrl, wishlitUrl } from "@/src/utils/url";
import Link from "next/link";

const Footer = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <>
            <footer className="dark-footer">
                <div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-3">
                                <div className="footer-widget">
                                    <img
                                        src={`${appUrl}/assets/img/wsh-logo-light.jpeg`}
                                        className="img-footer"
                                        alt="WSH-logo"
                                        style={{width: '80px', height: '100%'}}
                                    />
                                    <div className="footer-add">
                                        <address className="mb-4 lh-base">
                                            Alagbole, Ojodu Berger,
                                            <br />
                                            Lagos State, Nigeria.
                                        </address>
                                        <div className="d-flex align-items-center call-now gap-2 mb-3">
                                            <div className="square--30 circle">
                                                <i className="bi bi-telephone" />
                                            </div>
                                            <div className="fs-6 fw-semibold">+2349075144830</div>
                                        </div>
                                        <div className="d-flex align-items-center call-now gap-2">
                                            <div className="square--30 circle">
                                                <i className="bi bi-envelope" />
                                            </div>
                                            <div className="fs-6 fw-semibold">support@wsh.com</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3">
                                <div className="footer-widget">
                                    <h4 className="widget-title">Navigations</h4>
                                    <ul className="footer-menu">
                                        <li>
                                            <a href="#">About Us</a>
                                        </li>
                                        <li>
                                            <Link href={cartUrl}>Cart</Link>
                                        </li>
                                        <li>
                                            <a href="#">Contact</a>
                                        </li>
                                        <li>
                                            <a href="#">Terms & Conditions</a>
                                        </li>
                                        <li>
                                            <a href="#">Privacy Policy</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3">
                                <div className="footer-widget">
                                    <h4 className="widget-title">Help &amp; Support</h4>
                                    <ul className="footer-menu">
                                        <li>
                                        <a href="#">Documentation</a>
                                        </li>
                                        <li>
                                        <a href="#">Live Chat</a>
                                        </li>
                                        <li>
                                        <a href="#">Mail Us</a>
                                        </li>
                                        <li>
                                        <a href="#">Privacy</a>
                                        </li>
                                        <li>
                                        <a href="#">Faqs</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-12">
                                <div className="footer-widget">
                                    <h4 className="widget-title">Download Apps</h4>
                                    <a href="#" className="other-store-link">
                                        <div className="other-store-app">
                                            <div className="os-app-icon">
                                                <i className="bi bi-google-play" />
                                            </div>
                                            <div className="os-app-caps">
                                                Google Play
                                                <span>Get It Now</span>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="#" className="other-store-link">
                                        <div className="other-store-app">
                                            <div className="os-app-icon">
                                                <i className="bi bi-apple" />
                                            </div>
                                            <div className="os-app-caps">
                                                App Store
                                                <span>Now it Available</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="container">
                        <div className="row align-items-center g-3">
                            <div className="col-lg-6 col-md-6">
                                <p className="mb-0">
                                    © 2025 Women Skills Hub. Developed By{" "}
                                    {/* <a href="https://ledobiz.com/" style={{color: '#ffc107'}}>Ledobiz Technologies Ltd</a>. */}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6 text-md-end">
                                <ul className="footer-bottom-social">
                                    <li>
                                        <a href="#">
                                        <i className="ti-facebook" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                        <i className="ti-instagram" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                        <i className="ti-tiktok" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            
            <a id="back2Top" className="top-scroll" title="Back to top" href="#">
                <i className="ti-arrow-up" />
            </a>

            <a
                href="https://wa.me/2349075144830"
                aria-label="Chat with us on WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float pulse"
                style={{
                    position: 'fixed',
                    right: 20,
                    bottom: 70,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    zIndex: 1050
                }}
            >
                <i className="bi bi-whatsapp" style={{fontSize: 24}} />
            </a>
        </>
    )
}
export default Footer