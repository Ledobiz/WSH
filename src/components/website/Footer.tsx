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
            
            <div
                className="modal fade"
                id="login"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="registermodal"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered login-pop-form"
                    role="document"
                >
                <div className="modal-content" id="registermodal">
                    <div className="position-absolute end-0 top-0 mt-3 me-3 z-1">
                        <span
                            className="square--30 circle bg-light z-2"
                            data-bs-dismiss="modal"
                            aria-hidden="true"
                        >
                            <i className="bi bi-x" />
                        </span>
                        </div>
                        <div className="modal-body p-4">
                            <div className="login-card">
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
                                <div className="login-caps mb-3">
                                    <div className="text-center">
                                        <h3 className="fw-semibold m-0">Welcome back</h3>
                                        <span>Please enter your details to sign in carefully.</span>
                                    </div>
                                </div>
                                <div className="social-login-wrap mb-4">
                                    <div className=" d-flex align-items-center justify-content-between gap-4">
                                        <a
                                            href="#"
                                            className="btn btn-outline-gray rounded-3 flex-fill"
                                        >
                                            <i className="bi bi-apple" />
                                        </a>
                                        <a
                                            href="#"
                                            className="btn btn-outline-gray rounded-3 flex-fill"
                                        >
                                            <i className="bi bi-google text-red" />
                                        </a>
                                        <a
                                            href="#"
                                            className="btn btn-outline-gray rounded-3 flex-fill"
                                        >
                                            <i className="bi bi-twitter text-info" />
                                        </a>
                                    </div>
                                </div>
                                <div className="deider-wrap w-100 mt-3 mb-5">
                                    <div className="d-block border-top position-relative">
                                        <span className="position-absolute top-50 start-50 translate-middle square--40 circle bg-white text-muted z-1">
                                        OR
                                        </span>
                                    </div>
                                </div>
                                <div className="login-form">
                                    <form>
                                        <div className="form-group mb-4">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email.."
                                        />
                                        </div>
                                        <div className="form-group mb-4">
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
                                        <div className="form-group mb-4">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="form-check">
                                            <input
                                                id="saveinfo"
                                                className="form-check-input"
                                                name="saveinfo"
                                                type="checkbox"
                                            />
                                            <label htmlFor="saveinfo" className="form-check-label">
                                                Remember me
                                            </label>
                                            </div>
                                            <div className="forget-password">
                                            <a href="#" className="text-decoration-underline">
                                                Forgot Password?
                                            </a>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="form-group mb-3">
                                        <button type="button" className="btn btn-main w-100">
                                            Sign In
                                        </button>
                                        </div>
                                        <div className="form-group">
                                        <div className="text-center text-muted">
                                            Don't have an account yet?{" "}
                                            <a
                                            href="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#signup"
                                            data-bs-dismiss="modal"
                                            className="fw-semibold"
                                            >
                                            Sign Up
                                            </a>
                                        </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div
                className="modal fade"
                id="signup"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="sign-up"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered login-pop-form"
                    role="document"
                >
                    <div className="modal-content" id="sign-up">
                        <div className="position-absolute end-0 top-0 mt-3 me-3 z-1">
                            <span
                                className="square--30 circle bg-light z-2"
                                data-bs-dismiss="modal"
                                aria-hidden="true"
                            >
                                <i className="bi bi-x" />
                            </span>
                        </div>
                        <div className="modal-body p-4">
                            <div className="login-card">
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
                                        <h2 className="fw-semibold m-0">Hi! Welcome to</h2>
                                        <h3 className="fw-semibold m-0">LearnUp Online Study Center</h3>
                                    </div>
                                </div>
                                <div className="login-form">
                                    <form>
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
                                                Already have an account on LearnUp?{" "}
                                                <a
                                                    href="#"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#login"
                                                    data-bs-dismiss="modal"
                                                    className="fw-semibold"
                                                >
                                                    Log In
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
                                        <div className="social-login-wrap">
                                            <div className=" d-flex align-items-center justify-content-between gap-4">
                                                <a
                                                    href="#"
                                                    className="btn btn-md btn-gray rounded-3 border-2 flex-fill"
                                                >
                                                    SignUp with
                                                    <i className="bi bi-apple ms-2" />
                                                </a>
                                                <a
                                                    href="#"
                                                    className="btn btn-md btn-gray rounded-3 border-2 flex-fill"
                                                >
                                                    SignUp with
                                                    <i className="bi bi-google text-red ms-2" />
                                                </a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <a id="back2Top" className="top-scroll" title="Back to top" href="#">
                <i className="ti-arrow-up" />
            </a>
        </>
    )
}
export default Footer