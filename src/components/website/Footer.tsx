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
                                            <div className="fs-6 fw-semibold">support@womenskillshub.com</div>
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
                                            <Link href="#">Terms & Conditions</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Privacy Policy</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3">
                                <div className="footer-widget">
                                    <h4 className="widget-title">Help &amp; Support</h4>
                                    <ul className="footer-menu">
                                        <li>
                                            <Link href="https://wa.me/2349075144830">Whatsapp</Link>
                                        </li>
                                        <li>
                                            <Link href="mailto:support@womenskillshub.com">Mail Us</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Faqs</Link>
                                        </li>
                                    </ul>
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
                                    © {new Date().getFullYear()} Women Skills Hub Limited. All Rights Reserved.
                                    {/* Developed By{" "} <a href="https://ledobiz.com/" style={{color: '#ffc107'}}>Ledobiz Technologies Ltd</a>. */}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6 text-md-end">
                                <ul className="footer-bottom-social">
                                    <li>
                                        <Link href="https://www.facebook.com/share/1BbVDSP7Ut/">
                                        <i className="ti-facebook" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.instagram.com/reel/DRBEZv_kxQn/?igsh=aWV3cXZtY2hwazls">
                                        <i className="ti-instagram" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://www.tiktok.com/@womenskillshub?_r=1&_t=ZS-92k75jCDjiq">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{marginBottom: '-3px'}}>
                                                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                                            </svg>
                                        </Link>
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