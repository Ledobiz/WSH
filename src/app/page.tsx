import Hero from "../components/website/Hero";
import Navbar from "../components/website/Navbar";

export default function Home() {
  	return (
		<div id="main-wrapper">
            <Navbar />

            <Hero />

            {/* ============================ Working Process Start ================================== */}
            <section>
                <div className="container">
                {/* Heading Row */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                    <div className="sec-heading center">
                        <h2>Work &amp; Process</h2>
                        <p>Working Process for Join And Benifits</p>
                    </div>
                    </div>
                </div>
                <div className="row justify-content-center gx-xl-5 g-4">
                    {/* Cource Grid 1 */}
                    <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="prc-wraps">
                        <div className="prc-icons mb-3">
                        <div className="square--80 circle bg-light-green mx-auto">
                            <span className="text-green fs-3">
                            <i className="bi bi-search" />
                            </span>
                        </div>
                        </div>
                        <div className="prc-caption text-center">
                        <h4>Find Course</h4>
                        <p className="text-muted-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                            enim ad minim veniam.
                        </p>
                        </div>
                    </div>
                    </div>
                    {/* Cource Grid 1 */}
                    <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="prc-wraps">
                        <div className="prc-icons mb-3">
                        <div className="square--80 circle bg-light-main mx-auto">
                            <span className="text-main fs-3">
                            <i className="bi bi-calendar-date" />
                            </span>
                        </div>
                        </div>
                        <div className="prc-caption text-center">
                        <h4>Book Your Scat</h4>
                        <p className="text-muted-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                            enim ad minim veniam.
                        </p>
                        </div>
                    </div>
                    </div>
                    {/* Cource Grid 1 */}
                    <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="prc-wraps">
                        <div className="prc-icons mb-3">
                        <div className="square--80 circle bg-light-red mx-auto">
                            <span className="text-red fs-3">
                            <i className="bi bi-shield-fill-check" />
                            </span>
                        </div>
                        </div>
                        <div className="prc-caption text-center">
                        <h4>Get Certified</h4>
                        <p className="text-muted-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                            enim ad minim veniam.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* ============================ Working Process End ================================== */}
            {/* ============================  Our Courses Start ================================== */}
            <section className="border-top">
                <div className="container">
                {/* Heading Row */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                    <div className="sec-heading center">
                        <h2>Explore Our Courses</h2>
                        <p>
                        Learn from Industry Experts and Advance Your Career with Practical
                        Skills
                        </p>
                    </div>
                    </div>
                </div>
                {/* Content Row */}
                <div className="row justify-content-center">
                    {/* tab Link */}
                    <div className="col-xl-12 col-lg-12 col-12">
                    <ul
                        className="nav nav-tabs simple smalls scroll-tab align-items-center justify-content-center border-0 mb-4"
                        id="courseTab"
                        role="tablist"
                    >
                        {/* nav item */}
                        <li className="nav-item ms-0" role="presentation">
                        <a
                            className="nav-link active"
                            id="pills-development-tab"
                            data-bs-toggle="pill"
                            href="#pills-development"
                            role="tab"
                            aria-controls="pills-development"
                            aria-selected="true"
                        >
                            Development
                        </a>
                        </li>
                        {/* nav item */}
                        <li className="nav-item" role="presentation">
                        <a
                            className="nav-link"
                            id="pills-design-tab"
                            data-bs-toggle="pill"
                            href="#pills-design"
                            role="tab"
                            aria-controls="pills-design"
                            aria-selected="false"
                            tabIndex={-1}
                        >
                            Design
                        </a>
                        </li>
                        {/* nav item */}
                        <li className="nav-item" role="presentation">
                        <a
                            className="nav-link"
                            id="pills-marketing-tab"
                            data-bs-toggle="pill"
                            href="#pills-marketing"
                            role="tab"
                            aria-controls="pills-marketing"
                            aria-selected="false"
                            tabIndex={-1}
                        >
                            Marketing
                        </a>
                        </li>
                        {/* nav item */}
                        <li className="nav-item" role="presentation">
                        <a
                            className="nav-link"
                            id="pills-business-tab"
                            data-bs-toggle="pill"
                            href="#pills-business"
                            role="tab"
                            aria-controls="pills-business"
                            aria-selected="false"
                            tabIndex={-1}
                        >
                            Business
                        </a>
                        </li>
                        {/* nav item */}
                        <li className="nav-item" role="presentation">
                        <a
                            className="nav-link"
                            id="pills-accounting-tab"
                            data-bs-toggle="pill"
                            href="#pills-accounting"
                            role="tab"
                            aria-controls="pills-accounting"
                            aria-selected="false"
                            tabIndex={-1}
                        >
                            Accounting
                        </a>
                        </li>
                    </ul>
                    </div>
                    {/* Tab Content */}
                    <div className="col-xl-12 col-lg-12 col-12">
                    <div className="tab-content" id="courseTabContent">
                        {/* Development Content */}
                        <div
                        className="tab-pane fade show active"
                        id="pills-development"
                        role="tabpanel"
                        aria-labelledby="pills-development-tab"
                        tabIndex={0}
                        >
                        <div className="row justify-content-center g-3">
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-1.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        HTML Mastery: Complete Guide to HTML from Basics to
                                        Advanced
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        32 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $149
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(2.22k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-1.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">Cody L.</span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-2.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Python Unleashed: Mastering JavaScript for Web
                                        Development
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        45 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $179
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(1.34k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-2.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Adam Lobby.
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-3.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        UX/UI Design Essentials: Designing User-Centered
                                        Interfaces
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        22 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $129
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(3.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-3.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Akkie Lume
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-4.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Backend Development with Node.js: Building Scalable
                                        Web Apps
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        39 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $129
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(2.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-4.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">Luer Luke</span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Design Content */}
                        <div
                        className="tab-pane fade"
                        id="pills-design"
                        role="tabpanel"
                        aria-labelledby="pills-design-tab"
                        tabIndex={0}
                        >
                        <div className="row justify-content-center g-3">
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-5.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Web Development Bootcamp: Learn to Build Modern
                                        Websites
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        48 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $199
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.8
                                        </span>
                                        <span className="total-reviews">(4.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-5.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Armika John
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-6.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        The Complete AI Guide: Learn ChatGPT, Generative AI
                                        &amp; More..
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        28 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $120
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.7
                                        </span>
                                        <span className="total-reviews">(3.65k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-3.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Luke Lumbus
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-7.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Advanced WordPress Techniques: Dive Deep into
                                        Styling and Layout
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        65 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $199
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.8
                                        </span>
                                        <span className="total-reviews">(4.36k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-6.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Ambus Kornil
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-8.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Backend Development with Node.js: Building Scalable
                                        Web Apps
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        31 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $155
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(1.57k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-2.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Agnil Marcho
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Marketing Content */}
                        <div
                        className="tab-pane fade"
                        id="pills-marketing"
                        role="tabpanel"
                        aria-labelledby="pills-marketing-tab"
                        tabIndex={0}
                        >
                        <div className="row justify-content-center g-3">
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-1.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    17h 30m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        HTML Mastery: Complete Guide to HTML from Basics to
                                        Advanced
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        32 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $149
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(2.22k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-2.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    15h 50m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Python Unleashed: Mastering JavaScript for Web
                                        Development
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        45 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $179
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(1.34k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-3.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    10h 50m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        UX/UI Design Essentials: Designing User-Centered
                                        Interfaces
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        22 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $129
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(3.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-4.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    20h 10m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Backend Development with Node.js: Building Scalable
                                        Web Apps
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        39 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $129
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(2.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Business Content */}
                        <div
                        className="tab-pane fade"
                        id="pills-business"
                        role="tabpanel"
                        aria-labelledby="pills-business-tab"
                        tabIndex={0}
                        >
                        <div className="row justify-content-center g-3">
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-5.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Web Development Bootcamp: Learn to Build Modern
                                        Websites
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        48 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $199
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.8
                                        </span>
                                        <span className="total-reviews">(4.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-5.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Armika John
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-6.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        The Complete AI Guide: Learn ChatGPT, Generative AI
                                        &amp; More..
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        28 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $120
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.7
                                        </span>
                                        <span className="total-reviews">(3.65k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-3.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Luke Lumbus
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-7.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Advanced WordPress Techniques: Dive Deep into
                                        Styling and Layout
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        65 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $199
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.8
                                        </span>
                                        <span className="total-reviews">(4.36k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-6.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Ambus Kornil
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-8.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Backend Development with Node.js: Building Scalable
                                        Web Apps
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        31 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $155
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(1.57k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer p-3">
                                <div className="education_block_author">
                                    <a
                                    href="#"
                                    className="d-flex align-items-center justify-content-start gap-2"
                                    >
                                    <span className="square--30">
                                        <img
                                        src="assets/img/avatar-2.jpg"
                                        className="img-fluid circle"
                                        alt="Author"
                                        />
                                    </span>
                                    <span className="text-dark fw-medium">
                                        Agnil Marcho
                                    </span>
                                    </a>
                                </div>
                                <div className="enrolled-link">
                                    <a href="#" className="main-link fw-medium">
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Accounting Content */}
                        <div
                        className="tab-pane fade"
                        id="pills-accounting"
                        role="tabpanel"
                        aria-labelledby="pills-accounting-tab"
                        tabIndex={0}
                        >
                        <div className="row justify-content-center g-3">
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-1.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    17h 30m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        HTML Mastery: Complete Guide to HTML from Basics to
                                        Advanced
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        32 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $149
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(2.22k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-2.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    15h 50m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Python Unleashed: Mastering JavaScript for Web
                                        Development
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        45 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $179
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(1.34k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-3.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    10h 50m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        UX/UI Design Essentials: Designing User-Centered
                                        Interfaces
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        22 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Beginner
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $129
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(3.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                            {/* Single Slide */}
                            <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="education_block_grid border">
                                <div className="education-thumb position-relative">
                                <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                    <a href="#" className="bookmark-button">
                                    <i className="bi bi-suit-heart" />
                                    </a>
                                </div>
                                <a href="course-detail.html">
                                    <img
                                    src="assets/img/courses-4.jpg"
                                    className="img-fluid"
                                    alt=""
                                    />
                                </a>
                                <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                    <span className="badge bg-dark rounded-pill">
                                    <i className="bi bi-clock-history me-1" />
                                    20h 10m
                                    </span>
                                </div>
                                </div>
                                <div className="education-body p-3">
                                <div className="education-title">
                                    <h4 className="fs-6 fw-medium">
                                    <a href="course-detail.html">
                                        Backend Development with Node.js: Building Scalable
                                        Web Apps
                                    </a>
                                    </h4>
                                </div>
                                <div className="cources-info">
                                    <ul>
                                    <li>
                                        <i className="bi bi-camera-reels" />
                                        39 Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-bar-chart" />
                                        Advance
                                    </li>
                                    <li>
                                        <i className="bi bi-coin" />
                                        $129
                                    </li>
                                    <li>
                                        <i className="bi bi-star-fill text-warning" />
                                        <span className="overall-rates text-dark fw-medium ms-1">
                                        4.9
                                        </span>
                                        <span className="total-reviews">(2.45k)</span>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                                <div className="education-footer border-0 p-3 pt-2">
                                <a
                                    href="#"
                                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                >
                                    Enrolled Now
                                    <i className="bi bi-arrow-right ms-2" />
                                </a>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* ============================   Our Courses End ================================== */}
            {/* ============================ Categories Start ================================== */}
            <section className="bg-light">
                <div className="container">
                {/* Heading Row */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                    <div className="sec-heading center">
                        <h2>Discover Categories</h2>
                        <p>
                        Browse a Wide Range of Subjects to Start Learning What You Love
                        </p>
                    </div>
                    </div>
                </div>
                {/* Content Row */}
                <div className="row justify-content-center g-4">
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-code-slash" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">
                            Web development
                        </h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">12</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-brush" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">UI/UX Design</h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">45</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-code-slash" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">
                            Web development
                        </h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">23</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-megaphone" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">
                            Digital marketing
                        </h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">56</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-briefcase" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">
                            Entrepreneurship
                        </h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">87</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-cash-stack" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">
                            Personal Finance
                        </h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">35</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-laptop" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">
                            IT &amp; Software
                        </h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">33</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                        <div className="icon-wraps">
                        <span className="icon-slap fs-1">
                            <i className="bi bi-heart-pulse" />
                        </span>
                        </div>
                        <div>
                        <h4 className="text-dark fw-normal mb-0 lh-base">
                            Health &amp; Fitness
                        </h4>
                        <span className="text-muted-2">
                            <span className="fw-semibold me-1">37</span>Courses
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* ============================ Categories End ================================== */}
            {/* ============================ Free Courses Start ================================== */}
            <section className="bg-light">
                <div className="container">
                {/* Heading Row */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                    <div className="sec-heading center">
                        <h2>Browse Our Free Courses</h2>
                        <p>
                        Learn from Industry Experts and Advance Your Career with Practical
                        Skills
                        </p>
                    </div>
                    </div>
                </div>
                {/* Content Row */}
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-lg-12">
                    <div className="arrow_slide four_slide arrow_middle">
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="education_block_grid border">
                            <div className="education-thumb position-relative">
                            <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                <a href="#" className="bookmark-button">
                                <i className="bi bi-suit-heart" />
                                </a>
                            </div>
                            <a href="course-detail.html">
                                <img
                                src="assets/img/co-1.jpg"
                                className="img-fluid"
                                alt=""
                                />
                            </a>
                            </div>
                            <div className="education-body p-3">
                            <div className="education-title">
                                <h4 className="fs-6 fw-medium">
                                <a href="course-detail.html">
                                    HTML Mastery: Complete Guide to HTML from Basics to
                                    Advanced
                                </a>
                                </h4>
                            </div>
                            <div className="cources-info">
                                <ul>
                                <li>
                                    <i className="bi bi-camera-reels" />
                                    32 Lectures
                                </li>
                                <li>
                                    <i className="bi bi-bar-chart" />
                                    Beginner
                                </li>
                                <li>
                                    <i className="bi bi-coin" />
                                    $149
                                </li>
                                <li>
                                    <i className="bi bi-star-fill text-warning" />
                                    <span className="overall-rates text-dark fw-medium ms-1">
                                    4.9
                                    </span>
                                    <span className="total-reviews">(2.22k)</span>
                                </li>
                                </ul>
                            </div>
                            </div>
                            <div className="education-footer p-3">
                            <div className="education_block_author">
                                <a
                                href="#"
                                className="d-flex align-items-center justify-content-start gap-2"
                                >
                                <span className="square--30">
                                    <img
                                    src="assets/img/avatar-1.jpg"
                                    className="img-fluid circle"
                                    alt="Author"
                                    />
                                </span>
                                <span className="text-dark fw-medium">Cody L.</span>
                                </a>
                            </div>
                            <div className="enrolled-link">
                                <a href="#" className="main-link fw-medium">
                                Enrolled Now
                                <i className="bi bi-arrow-right ms-2" />
                                </a>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="education_block_grid border">
                            <div className="education-thumb position-relative">
                            <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                <a href="#" className="bookmark-button">
                                <i className="bi bi-suit-heart" />
                                </a>
                            </div>
                            <a href="course-detail.html">
                                <img
                                src="assets/img/co-2.jpg"
                                className="img-fluid"
                                alt=""
                                />
                            </a>
                            </div>
                            <div className="education-body p-3">
                            <div className="education-title">
                                <h4 className="fs-6 fw-medium">
                                <a href="course-detail.html">
                                    Python Unleashed: Mastering JavaScript for Web
                                    Development
                                </a>
                                </h4>
                            </div>
                            <div className="cources-info">
                                <ul>
                                <li>
                                    <i className="bi bi-camera-reels" />
                                    45 Lectures
                                </li>
                                <li>
                                    <i className="bi bi-bar-chart" />
                                    Advance
                                </li>
                                <li>
                                    <i className="bi bi-coin" />
                                    $179
                                </li>
                                <li>
                                    <i className="bi bi-star-fill text-warning" />
                                    <span className="overall-rates text-dark fw-medium ms-1">
                                    4.9
                                    </span>
                                    <span className="total-reviews">(1.34k)</span>
                                </li>
                                </ul>
                            </div>
                            </div>
                            <div className="education-footer p-3">
                            <div className="education_block_author">
                                <a
                                href="#"
                                className="d-flex align-items-center justify-content-start gap-2"
                                >
                                <span className="square--30">
                                    <img
                                    src="assets/img/avatar-2.jpg"
                                    className="img-fluid circle"
                                    alt="Author"
                                    />
                                </span>
                                <span className="text-dark fw-medium">Adam Lobby.</span>
                                </a>
                            </div>
                            <div className="enrolled-link">
                                <a href="#" className="main-link fw-medium">
                                Enrolled Now
                                <i className="bi bi-arrow-right ms-2" />
                                </a>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="education_block_grid border">
                            <div className="education-thumb position-relative">
                            <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                <a href="#" className="bookmark-button">
                                <i className="bi bi-suit-heart" />
                                </a>
                            </div>
                            <a href="course-detail.html">
                                <img
                                src="assets/img/co-3.jpg"
                                className="img-fluid"
                                alt=""
                                />
                            </a>
                            </div>
                            <div className="education-body p-3">
                            <div className="education-title">
                                <h4 className="fs-6 fw-medium">
                                <a href="course-detail.html">
                                    UX/UI Design Essentials: Designing User-Centered
                                    Interfaces
                                </a>
                                </h4>
                            </div>
                            <div className="cources-info">
                                <ul>
                                <li>
                                    <i className="bi bi-camera-reels" />
                                    22 Lectures
                                </li>
                                <li>
                                    <i className="bi bi-bar-chart" />
                                    Beginner
                                </li>
                                <li>
                                    <i className="bi bi-coin" />
                                    $129
                                </li>
                                <li>
                                    <i className="bi bi-star-fill text-warning" />
                                    <span className="overall-rates text-dark fw-medium ms-1">
                                    4.9
                                    </span>
                                    <span className="total-reviews">(3.45k)</span>
                                </li>
                                </ul>
                            </div>
                            </div>
                            <div className="education-footer p-3">
                            <div className="education_block_author">
                                <a
                                href="#"
                                className="d-flex align-items-center justify-content-start gap-2"
                                >
                                <span className="square--30">
                                    <img
                                    src="assets/img/avatar-3.jpg"
                                    className="img-fluid circle"
                                    alt="Author"
                                    />
                                </span>
                                <span className="text-dark fw-medium">Akkie Lume</span>
                                </a>
                            </div>
                            <div className="enrolled-link">
                                <a href="#" className="main-link fw-medium">
                                Enrolled Now
                                <i className="bi bi-arrow-right ms-2" />
                                </a>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="education_block_grid border">
                            <div className="education-thumb position-relative">
                            <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                <a href="#" className="bookmark-button">
                                <i className="bi bi-suit-heart" />
                                </a>
                            </div>
                            <a href="course-detail.html">
                                <img
                                src="assets/img/co-4.jpg"
                                className="img-fluid"
                                alt=""
                                />
                            </a>
                            </div>
                            <div className="education-body p-3">
                            <div className="education-title">
                                <h4 className="fs-6 fw-medium">
                                <a href="course-detail.html">
                                    Backend Development with Node.js: Building Scalable Web
                                    Apps
                                </a>
                                </h4>
                            </div>
                            <div className="cources-info">
                                <ul>
                                <li>
                                    <i className="bi bi-camera-reels" />
                                    39 Lectures
                                </li>
                                <li>
                                    <i className="bi bi-bar-chart" />
                                    Advance
                                </li>
                                <li>
                                    <i className="bi bi-coin" />
                                    $129
                                </li>
                                <li>
                                    <i className="bi bi-star-fill text-warning" />
                                    <span className="overall-rates text-dark fw-medium ms-1">
                                    4.9
                                    </span>
                                    <span className="total-reviews">(2.45k)</span>
                                </li>
                                </ul>
                            </div>
                            </div>
                            <div className="education-footer p-3">
                            <div className="education_block_author">
                                <a
                                href="#"
                                className="d-flex align-items-center justify-content-start gap-2"
                                >
                                <span className="square--30">
                                    <img
                                    src="assets/img/avatar-4.jpg"
                                    className="img-fluid circle"
                                    alt="Author"
                                    />
                                </span>
                                <span className="text-dark fw-medium">Luer Luke</span>
                                </a>
                            </div>
                            <div className="enrolled-link">
                                <a href="#" className="main-link fw-medium">
                                Enrolled Now
                                <i className="bi bi-arrow-right ms-2" />
                                </a>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="education_block_grid border">
                            <div className="education-thumb position-relative">
                            <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                <a href="#" className="bookmark-button">
                                <i className="bi bi-suit-heart" />
                                </a>
                            </div>
                            <a href="course-detail.html">
                                <img
                                src="assets/img/co-5.jpg"
                                className="img-fluid"
                                alt=""
                                />
                            </a>
                            </div>
                            <div className="education-body p-3">
                            <div className="education-title">
                                <h4 className="fs-6 fw-medium">
                                <a href="course-detail.html">
                                    Web Development Bootcamp: Learn to Build Modern Websites
                                </a>
                                </h4>
                            </div>
                            <div className="cources-info">
                                <ul>
                                <li>
                                    <i className="bi bi-camera-reels" />
                                    48 Lectures
                                </li>
                                <li>
                                    <i className="bi bi-bar-chart" />
                                    Beginner
                                </li>
                                <li>
                                    <i className="bi bi-coin" />
                                    $199
                                </li>
                                <li>
                                    <i className="bi bi-star-fill text-warning" />
                                    <span className="overall-rates text-dark fw-medium ms-1">
                                    4.8
                                    </span>
                                    <span className="total-reviews">(4.45k)</span>
                                </li>
                                </ul>
                            </div>
                            </div>
                            <div className="education-footer p-3">
                            <div className="education_block_author">
                                <a
                                href="#"
                                className="d-flex align-items-center justify-content-start gap-2"
                                >
                                <span className="square--30">
                                    <img
                                    src="assets/img/avatar-5.jpg"
                                    className="img-fluid circle"
                                    alt="Author"
                                    />
                                </span>
                                <span className="text-dark fw-medium">Armika John</span>
                                </a>
                            </div>
                            <div className="enrolled-link">
                                <a href="#" className="main-link fw-medium">
                                Enrolled Now
                                <i className="bi bi-arrow-right ms-2" />
                                </a>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="education_block_grid border">
                            <div className="education-thumb position-relative">
                            <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                <a href="#" className="bookmark-button">
                                <i className="bi bi-suit-heart" />
                                </a>
                            </div>
                            <a href="course-detail.html">
                                <img
                                src="assets/img/co-6.jpg"
                                className="img-fluid"
                                alt=""
                                />
                            </a>
                            </div>
                            <div className="education-body p-3">
                            <div className="education-title">
                                <h4 className="fs-6 fw-medium">
                                <a href="course-detail.html">
                                    The Complete AI Guide: Learn ChatGPT, Generative AI
                                    &amp; More..
                                </a>
                                </h4>
                            </div>
                            <div className="cources-info">
                                <ul>
                                <li>
                                    <i className="bi bi-camera-reels" />
                                    28 Lectures
                                </li>
                                <li>
                                    <i className="bi bi-bar-chart" />
                                    Advance
                                </li>
                                <li>
                                    <i className="bi bi-coin" />
                                    $120
                                </li>
                                <li>
                                    <i className="bi bi-star-fill text-warning" />
                                    <span className="overall-rates text-dark fw-medium ms-1">
                                    4.7
                                    </span>
                                    <span className="total-reviews">(3.65k)</span>
                                </li>
                                </ul>
                            </div>
                            </div>
                            <div className="education-footer p-3">
                            <div className="education_block_author">
                                <a
                                href="#"
                                className="d-flex align-items-center justify-content-start gap-2"
                                >
                                <span className="square--30">
                                    <img
                                    src="assets/img/avatar-3.jpg"
                                    className="img-fluid circle"
                                    alt="Author"
                                    />
                                </span>
                                <span className="text-dark fw-medium">Luke Lumbus</span>
                                </a>
                            </div>
                            <div className="enrolled-link">
                                <a href="#" className="main-link fw-medium">
                                Enrolled Now
                                <i className="bi bi-arrow-right ms-2" />
                                </a>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="education_block_grid border">
                            <div className="education-thumb position-relative">
                            <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                                <a href="#" className="bookmark-button">
                                <i className="bi bi-suit-heart" />
                                </a>
                            </div>
                            <a href="course-detail.html">
                                <img
                                src="assets/img/co-7.jpg"
                                className="img-fluid"
                                alt=""
                                />
                            </a>
                            </div>
                            <div className="education-body p-3">
                            <div className="education-title">
                                <h4 className="fs-6 fw-medium">
                                <a href="course-detail.html">
                                    Advanced WordPress Techniques: Dive Deep into Styling
                                    and Layout
                                </a>
                                </h4>
                            </div>
                            <div className="cources-info">
                                <ul>
                                <li>
                                    <i className="bi bi-camera-reels" />
                                    65 Lectures
                                </li>
                                <li>
                                    <i className="bi bi-bar-chart" />
                                    Advance
                                </li>
                                <li>
                                    <i className="bi bi-coin" />
                                    $199
                                </li>
                                <li>
                                    <i className="bi bi-star-fill text-warning" />
                                    <span className="overall-rates text-dark fw-medium ms-1">
                                    4.8
                                    </span>
                                    <span className="total-reviews">(4.36k)</span>
                                </li>
                                </ul>
                            </div>
                            </div>
                            <div className="education-footer p-3">
                            <div className="education_block_author">
                                <a
                                href="#"
                                className="d-flex align-items-center justify-content-start gap-2"
                                >
                                <span className="square--30">
                                    <img
                                    src="assets/img/avatar-6.jpg"
                                    className="img-fluid circle"
                                    alt="Author"
                                    />
                                </span>
                                <span className="text-dark fw-medium">Ambus Kornil</span>
                                </a>
                            </div>
                            <div className="enrolled-link">
                                <a href="#" className="main-link fw-medium">
                                Enrolled Now
                                <i className="bi bi-arrow-right ms-2" />
                                </a>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* ============================ Free Courses End ================================== */}
            {/* ========================== Why Choose Us Start =============================== */}
            <section>
                <div className="container">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="benifit-oflearning">
                        <div className="d-block mb-4">
                        <h2>Benifit of online learning</h2>
                        <p>
                            We’re developing an innovative Bootstrap-powered UI Kit tool
                            designed specifically for developers, engineers, full-stack
                            developers, and digital agencies.
                        </p>
                        </div>
                        <div className="benifit-wraps mb-4">
                        <div className="d-flex flex-column gap-4">
                            {/* Single Item */}
                            <div className="d-flex align-items-center justify-content-start gap-3">
                            <div className="icons">
                                <span className="square--50 circle bg-light-green fs-5">
                                <i className="bi bi-patch-check-fill text-green" />
                                </span>
                            </div>
                            <div className="caps">
                                <h5>Wide Range of Courses</h5>
                                <p className="text-muted-2 m-0">
                                Choose from thousands of subjects and skills.
                                </p>
                            </div>
                            </div>
                            {/* Single Item */}
                            <div className="d-flex align-items-center justify-content-start gap-3">
                            <div className="icons">
                                <span className="square--50 circle bg-light-green fs-5">
                                <i className="bi bi-patch-check-fill text-green" />
                                </span>
                            </div>
                            <div className="caps">
                                <h5>Cost-Effective</h5>
                                <p className="text-muted-2 m-0">
                                Often more affordable than traditional classroom learning.
                                </p>
                            </div>
                            </div>
                            {/* Single Item */}
                            <div className="d-flex align-items-center justify-content-start gap-3">
                            <div className="icons">
                                <span className="square--50 circle bg-light-green fs-5">
                                <i className="bi bi-patch-check-fill text-green" />
                                </span>
                            </div>
                            <div className="caps">
                                <h5>Global Networking</h5>
                                <p className="text-muted-2 m-0">
                                Connect with learners and instructors from around the
                                world.
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <a href="#" className="btn btn-main rounded-pill px-5">
                        Create an Account
                        </a>
                    </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="facts-img">
                        <img src="assets/img/hero-img-2.png" className="img-fluid" alt="" />
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* ========================== Why Choose Us End =============================== */}
            {/* ============================  Reviews Start ================================== */}
            <section className="bg-light">
                <div className="container">
                {/* Heading Row */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                    <div className="sec-heading center">
                        <h2>Hear from Our Students</h2>
                        <p>
                        Discover What Learners Around the World Are Saying About Our
                        Courses
                        </p>
                    </div>
                    </div>
                </div>
                {/* Content Row */}
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-lg-12">
                    <div className="arrow_slide reviews-slide arrow_middle">
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="card-hover p-4 rounded-3 card card-body m-0">
                            <div className="rating-star">
                            <div className="d-flex align-items-center gap-1 mb-2">
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                            </div>
                            </div>
                            <div className="review-caption d-block mb-4">
                            <h5 className="text-dark fw-semibold mb-0 lh-base">
                                "Awesome service and courses."
                            </h5>
                            <p className="text-muted-2">
                                In a professional context it often happens that private or
                                corporate clients corder a publication to be made and
                                presented with the actual.
                            </p>
                            </div>
                            <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                            <div className="revierwer-avatar d-flex align-items-center gap-2">
                                <div className="avatar-box">
                                <img
                                    src="assets/img/avatar-1.jpg"
                                    className="img-fluid square--50 circle"
                                    alt="Avatar Image"
                                />
                                </div>
                                <div className="reviewer-caps">
                                <h6 className="fw-semibold text-dark m-0">
                                    Taylor Morgan
                                </h6>
                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                </div>
                            </div>
                            <div className="reviewer-post">
                                <span className="badge bg-green rounded-pill">Student</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="card-hover p-4 rounded-3 card card-body m-0">
                            <div className="rating-star">
                            <div className="d-flex align-items-center gap-1 mb-2">
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                            </div>
                            </div>
                            <div className="review-caption d-block mb-4">
                            <h5 className="text-dark fw-semibold mb-0 lh-base">
                                "Awesome service and courses."
                            </h5>
                            <p className="text-muted-2">
                                In a professional context it often happens that private or
                                corporate clients corder a publication to be made and
                                presented with the actual.
                            </p>
                            </div>
                            <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                            <div className="revierwer-avatar d-flex align-items-center gap-2">
                                <div className="avatar-box">
                                <img
                                    src="assets/img/avatar-2.jpg"
                                    className="img-fluid square--50 circle"
                                    alt="Avatar Image"
                                />
                                </div>
                                <div className="reviewer-caps">
                                <h6 className="fw-semibold text-dark m-0">Cameron Lee</h6>
                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                </div>
                            </div>
                            <div className="reviewer-post">
                                <span className="badge bg-green rounded-pill">Student</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="card-hover p-4 rounded-3 card card-body m-0">
                            <div className="rating-star">
                            <div className="d-flex align-items-center gap-1 mb-2">
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                            </div>
                            </div>
                            <div className="review-caption d-block mb-4">
                            <h5 className="text-dark fw-semibold mb-0 lh-base">
                                "Awesome service and courses."
                            </h5>
                            <p className="text-muted-2">
                                In a professional context it often happens that private or
                                corporate clients corder a publication to be made and
                                presented with the actual.
                            </p>
                            </div>
                            <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                            <div className="revierwer-avatar d-flex align-items-center gap-2">
                                <div className="avatar-box">
                                <img
                                    src="assets/img/avatar-3.jpg"
                                    className="img-fluid square--50 circle"
                                    alt="Avatar Image"
                                />
                                </div>
                                <div className="reviewer-caps">
                                <h6 className="fw-semibold text-dark m-0">
                                    Jamie Brooks
                                </h6>
                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                </div>
                            </div>
                            <div className="reviewer-post">
                                <span className="badge bg-green rounded-pill">Student</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="card-hover p-4 rounded-3 card card-body m-0">
                            <div className="rating-star">
                            <div className="d-flex align-items-center gap-1 mb-2">
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                            </div>
                            </div>
                            <div className="review-caption d-block mb-4">
                            <h5 className="text-dark fw-semibold mb-0 lh-base">
                                "Awesome service and courses."
                            </h5>
                            <p className="text-muted-2">
                                In a professional context it often happens that private or
                                corporate clients corder a publication to be made and
                                presented with the actual.
                            </p>
                            </div>
                            <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                            <div className="revierwer-avatar d-flex align-items-center gap-2">
                                <div className="avatar-box">
                                <img
                                    src="assets/img/avatar-4.jpg"
                                    className="img-fluid square--50 circle"
                                    alt="Avatar Image"
                                />
                                </div>
                                <div className="reviewer-caps">
                                <h6 className="fw-semibold text-dark m-0">Riley James</h6>
                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                </div>
                            </div>
                            <div className="reviewer-post">
                                <span className="badge bg-green rounded-pill">Student</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="card-hover p-4 rounded-3 card card-body m-0">
                            <div className="rating-star">
                            <div className="d-flex align-items-center gap-1 mb-2">
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                            </div>
                            </div>
                            <div className="review-caption d-block mb-4">
                            <h5 className="text-dark fw-semibold mb-0 lh-base">
                                "Awesome service and courses."
                            </h5>
                            <p className="text-muted-2">
                                In a professional context it often happens that private or
                                corporate clients corder a publication to be made and
                                presented with the actual.
                            </p>
                            </div>
                            <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                            <div className="revierwer-avatar d-flex align-items-center gap-2">
                                <div className="avatar-box">
                                <img
                                    src="assets/img/avatar-5.jpg"
                                    className="img-fluid square--50 circle"
                                    alt="Avatar Image"
                                />
                                </div>
                                <div className="reviewer-caps">
                                <h6 className="fw-semibold text-dark m-0">Casey Allen</h6>
                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                </div>
                            </div>
                            <div className="reviewer-post">
                                <span className="badge bg-green rounded-pill">Student</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Single Slide */}
                        <div className="singles_items">
                        <div className="card-hover p-4 rounded-3 card card-body m-0">
                            <div className="rating-star">
                            <div className="d-flex align-items-center gap-1 mb-2">
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                                <span className="text-warning">
                                <i className="bi bi-star-fill" />
                                </span>
                            </div>
                            </div>
                            <div className="review-caption d-block mb-4">
                            <h5 className="text-dark fw-semibold mb-0 lh-base">
                                "Awesome service and courses."
                            </h5>
                            <p className="text-muted-2">
                                In a professional context it often happens that private or
                                corporate clients corder a publication to be made and
                                presented with the actual.
                            </p>
                            </div>
                            <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                            <div className="revierwer-avatar d-flex align-items-center gap-2">
                                <div className="avatar-box">
                                <img
                                    src="assets/img/avatar-6.jpg"
                                    className="img-fluid square--50 circle"
                                    alt="Avatar Image"
                                />
                                </div>
                                <div className="reviewer-caps">
                                <h6 className="fw-semibold text-dark m-0">
                                    Jordan Blake
                                </h6>
                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                </div>
                            </div>
                            <div className="reviewer-post">
                                <span className="badge bg-green rounded-pill">Student</span>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* ============================  Reviews End ================================== */}
            {/* ============================== Start Newsletter ================================== */}
            <section
                className="bg-cover newsletter bg-main position-relative"
                style={{ background: "url(assets/img/subscribe-bg.png)" }}
            >
                <div className="container">
                <div className="row">
                    <div className="col-xl-7 col-lg-9 col-md-10 col-sm-12">
                    <div className="text-start">
                        <div className="subscribe-caption d-block mb-4">
                        <div className="d-flex align-items-center mb-1">
                            <span className="label bg-warning rounded-pill text-dark">
                            <i className="bi bi-patch-check me-2" />
                            Get Certificate
                            </span>
                        </div>
                        <h2 className="fs-1 lh-base text-light">
                            Advance Your Learning with LearnUp's Quality Certification
                        </h2>
                        <p className="text-light opacity-75">
                            Subscribe our newsletter &amp; get latest news and updation!
                        </p>
                        </div>
                        <div className="d-block join-block">
                        <div className="d-flex align-items-center justify-content-start flex-wrap gap-3">
                            <a href="#" className="btn mid btn-whites rounded-pill px-4">
                            Get Started Today
                            <i className="bi bi-send ms-2" />
                            </a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="position-absolute end-0 bottom-0 d-none d-lg-block">
                <img
                    src="assets/img/subscribe-shapes.png"
                    className="img-fluid"
                    width={500}
                    alt="Image"
                />
                </div>
            </section>
            {/* ================================= End Newsletter =============================== */}
            {/* ============================ Footer Start ================================== */}
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
            {/* ============================ Footer End ================================== */}
            {/* Log In Modal */}
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
                            src="assets/img/logo-icon.png"
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
            {/* End Modal */}
            {/* Sign Up Modal */}
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
                            src="assets/img/logo-icon.png"
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
            {/* End Modal */}
            <a id="back2Top" className="top-scroll" title="Back to top" href="#">
                <i className="ti-arrow-up" />
            </a>
            </div>

  	);
}
