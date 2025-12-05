const Footer = () => {
    return (
        <>
            <footer className="dark-footer">
                <div>
                    <div className="container">
                        <div className="row">
                        <div className="col-lg-3 col-md-3">
                            <div className="footer-widget">
                            <img
                                src="assets/img/logo-light.png"
                                className="img-footer"
                                alt=""
                            />
                            <div className="footer-add">
                                <address className="mb-4 lh-base">
                                4967 Sardis Sta, Victoria 8007, Montreal
                                <br />
                                United State
                                </address>
                                <div className="d-flex align-items-center call-now gap-2 mb-3">
                                <div className="square--30 circle bg-light-main text-main">
                                    <i className="bi bi-telephone" />
                                </div>
                                <div className="fs-6 fw-semibold">+1 246-345-0695</div>
                                </div>
                                <div className="d-flex align-items-center call-now gap-2">
                                <div className="square--30 circle bg-light-main text-main">
                                    <i className="bi bi-envelope" />
                                </div>
                                <div className="fs-6 fw-semibold">support@learnup.com</div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-3">
                            <div className="footer-widget">
                            <h4 className="widget-title">Navigations</h4>
                            <ul className="footer-menu">
                                <li>
                                <a href="about-us.html">About Us</a>
                                </li>
                                <li>
                                <a href="faq.html">FAQs Page</a>
                                </li>
                                <li>
                                <a href="checkout.html">Checkout</a>
                                </li>
                                <li>
                                <a href="contact.html">Contact</a>
                                </li>
                                <li>
                                <a href="blog.html">Blog</a>
                                </li>
                            </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-3">
                            <div className="footer-widget">
                            <h4 className="widget-title">New Categories</h4>
                            <ul className="footer-menu">
                                <li>
                                <a href="#">Designing</a>
                                </li>
                                <li>
                                <a href="#">Nusiness</a>
                                </li>
                                <li>
                                <a href="#">Software</a>
                                </li>
                                <li>
                                <a href="#">WordPress</a>
                                </li>
                                <li>
                                <a href="#">PHP</a>
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
                            <a href="https://ledobiz.com/">Ledobiz Technologies Ltd</a>.
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
                                <i className="ti-twitter" />
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                <i className="ti-instagram" />
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                <i className="ti-linkedin" />
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
        </>
    )
}
export default Footer