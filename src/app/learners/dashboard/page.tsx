import Navbar from "@/src/components/dashboard/Navbar";
import NavBreadcrumb from "@/src/components/dashboard/NavBreadcrumb";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import { courseContentUrl } from "@/src/utils/url";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Student Dashboard - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Dashboard = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <>    
            <Navbar />

            <section
                className="bg-cover p-0 d-none d-md-block"
                style={{ background: `url(${appUrl}/assets/img/student-bg.jpg)no-repeat` }}
                data-overlay={4}
            >
                <div className="container-fluid px-0">
                    <div className="ht-250" />
                </div>
            </section>

            <section className="pt-4">
                <div className="container">
                    <div className="row gx-xl-5">
                        <Sidebar />

                        <div className="col-lg-9 col-md-12 col-sm-12">
                            <NavBreadcrumb page="Dashboard" />
                            
                            <Suspense fallback={<Loading />}>
                                <div className="row g-3 mb-4">
                                    {/* CARD 1 */}
                                    <div className="col-12 col-sm-6 col-lg-3">
                                        <div
                                            className="stat-card position-relative shadow-lg text-white p-4 rounded-4"
                                            style={{ background: "linear-gradient(135deg, #4666ff, #7b38ff)" }}
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                            {/* Top-right number */}
                                            <span className="position-absolute top-0 end-0 m-3 fw-bold fs-4">
                                            3
                                            </span>
                                            {/* Icon */}
                                            <div className="mb-3">
                                                <div
                                                    className="icon-box d-inline-flex align-items-center justify-content-center rounded-3"
                                                    style={{
                                                    background: "rgba(255,255,255,0.15)",
                                                    width: 45,
                                                    height: 45
                                                    }}
                                                >
                                                    <i className="bi bi-book fs-4" />
                                                </div>
                                            </div>
                                            {/* Text */}
                                            <h5 className="opacity-75 text-white mb-1">Active Courses</h5>
                                            <p className="opacity-75 mb-0">In progress</p>
                                            {/* Circular highlight */}
                                            <div className="circle-bg" />
                                        </div>
                                    </div>
                                    {/* CARD 2 */}
                                    <div className="col-12 col-sm-6 col-lg-3">
                                        <div
                                            className="stat-card position-relative shadow-lg text-white p-4 rounded-4"
                                            style={{ background: "linear-gradient(135deg, #b83aff, #7b38ff)" }}
                                        >
                                            <span className="position-absolute top-0 end-0 m-3 fw-bold fs-4">
                                            0
                                            </span>
                                            <div className="mb-3">
                                                <div
                                                    className="icon-box d-inline-flex align-items-center justify-content-center rounded-3"
                                                    style={{
                                                    background: "rgba(255,255,255,0.15)",
                                                    width: 45,
                                                    height: 45
                                                    }}
                                                >
                                                    <i className="bi bi-check-circle fs-4" />
                                                </div>
                                            </div>
                                            <h5 className="opacity-75 text-white mb-1">Lessons Complete</h5>
                                            <p className="opacity-75 mb-0">Keep learning!</p>
                                            <div className="circle-bg" />
                                        </div>
                                    </div>
                                    {/* CARD 3 */}
                                    <div className="col-12 col-sm-6 col-lg-3">
                                        <div
                                            className="stat-card position-relative shadow-lg text-white p-4 rounded-4"
                                            style={{ background: "linear-gradient(135deg, #ff9800, #f44336)" }}
                                        >
                                            <span className="position-absolute top-0 end-0 m-3 fw-bold fs-4">
                                            0
                                            </span>
                                            <div className="mb-3">
                                                <div
                                                    className="icon-box d-inline-flex align-items-center justify-content-center rounded-3"
                                                    style={{
                                                    background: "rgba(255,255,255,0.15)",
                                                    width: 45,
                                                    height: 45
                                                    }}
                                                >
                                                    <i className="bi bi-patch-check-fill fs-4" />
                                                </div>
                                            </div>
                                            <h5 className="opacity-75 text-white mb-1">Certificates</h5>
                                            <p className="opacity-75 mb-0">From specified courses</p>
                                            <div className="circle-bg" />
                                        </div>
                                    </div>
                                    {/* CARD 4 */}
                                    <div className="col-12 col-sm-6 col-lg-3">
                                        <div
                                            className="stat-card position-relative shadow-lg text-white p-4 rounded-4"
                                            style={{ background: "linear-gradient(135deg, #00b97c, #0ca77f)" }}
                                        >
                                            <span className="position-absolute top-0 end-0 m-3 fw-bold fs-4">
                                            0
                                            </span>
                                            <div className="mb-3">
                                                <div
                                                    className="icon-box d-inline-flex align-items-center justify-content-center rounded-3"
                                                    style={{
                                                    background: "rgba(255,255,255,0.15)",
                                                    width: 45,
                                                    height: 45
                                                    }}
                                                >
                                                    <i className="bi bi-lightning-charge fs-4" />
                                                </div>
                                            </div>
                                            <h5 className="opacity-75 text-white mb-1">Day Streak</h5>
                                            <p className="opacity-75 mb-0">Start learning today!</p>
                                            <div className="circle-bg" />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-12 mb-0">
                                        <div className="d-flex align-items-start justify-content-between gap-2 flex-column flex-sm-row">
                                            <div className="head-title">
                                                <h4 className="mb-2 mb-sm-0">Continue Learning</h4>
                                                <p className="text-muted mb-0">Pick up where you left off</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card border-0 hover shadow-sm mb-3 rounded-4 p-3">
                                        <Link href={`${courseContentUrl}/mack-and-cheeze`} className="row g-3 g-md-4 align-items-center">
                                            <div className="col-12 col-xl-4 col-lg-4 col-md-4">
                                                <div
                                                    className="rounded-3 p-3 bg-light d-flex align-items-center justify-content-center mx-auto mx-sm-0"
                                                    style={{
                                                        background: "linear-gradient(135deg, #dee8ff, #f3e8ff)"
                                                    }}
                                                >
                                                    <img src="ICON.png" alt="icon" style={{width: '100%', height: '200px'}} className="img-fluid" />
                                                </div>
                                            </div>

                                            {/* Text column */}
                                            <div className="col">
                                                <h5 className="fw-bold mb-1">Seller Financing Mastery</h5>

                                                <div className="d-flex flex-wrap align-items-center text-muted small mb-2">
                                                    <i className="bi bi-journal-bookmark me-1" /> 0 lessons
                                                    <span className="mx-2">•</span>
                                                    <i className="bi bi-clock me-1" /> 1h 53m
                                                </div>

                                                <div className="w-100">
                                                    <div className="d-flex justify-content-between small text-muted">
                                                        <span>Progress</span>
                                                        <span>0%</span>
                                                    </div>
                                                    <div className="progress mt-1" style={{ height: 6 }}>
                                                        <div className="progress-bar" style={{ width: "0%" }} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chevron (hidden on xs) */}
                                            <div className="col-auto d-none d-sm-block">
                                                <i className="bi bi-chevron-right fs-5 text-muted" />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="card border-0 hover shadow-sm mb-3 rounded-4 p-3">
                                        <Link href={`${courseContentUrl}/mack-and-cheeze`} className="row g-3 g-md-4 align-items-center">
                                            <div className="col-12 col-xl-4 col-lg-4 col-md-4">
                                                <div
                                                    className="rounded-3 p-3 bg-light d-flex align-items-center justify-content-center mx-auto mx-sm-0"
                                                    style={{
                                                        background: "linear-gradient(135deg, #dee8ff, #f3e8ff)"
                                                    }}
                                                >
                                                    <img src="ICON.png" alt="icon" style={{width: '100%', height: '200px'}} className="img-fluid" />
                                                </div>
                                            </div>

                                            {/* Text column */}
                                            <div className="col">
                                                <h5 className="fw-bold mb-1">Seller Financing Mastery</h5>

                                                <div className="d-flex flex-wrap align-items-center text-muted small mb-2">
                                                    <i className="bi bi-journal-bookmark me-1" /> 0 lessons
                                                    <span className="mx-2">•</span>
                                                    <i className="bi bi-clock me-1" /> 1h 53m
                                                </div>

                                                <div className="w-100">
                                                    <div className="d-flex justify-content-between small text-muted">
                                                        <span>Progress</span>
                                                        <span>0%</span>
                                                    </div>
                                                    <div className="progress mt-1" style={{ height: 6 }}>
                                                        <div className="progress-bar" style={{ width: "0%" }} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chevron (hidden on xs) */}
                                            <div className="col-auto d-none d-sm-block">
                                                <i className="bi bi-chevron-right fs-5 text-muted" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className="text-center p-5">
                                <img
                                    src={`${appUrl}/assets/img/empty.svg`}
                                    alt="Empty State"
                                    className="img-fluid mb-4"
                                    style={{ maxWidth: 260, opacity: "0.9" }}
                                />
                                <h4 className="fw-bold">No Courses Yet</h4>
                                <p className="text-muted mb-4">
                                    Start your learning journey by exploring our available courses.
                                </p>
                                <button className="btn btn-main px-4 py-2">Browse Courses</button>
                                </div>


                                
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                                            <div className="head-title">
                                                <h4 className="mb-2 mb-sm-0">Browse All Courses</h4>
                                            </div>
                                            <div className="view-all">
                                                <a href="#" className="btns text-muted mb-0">
                                                    View All
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="row g-3">
                                            {/* Single Slide */}
                                            <div className="col-xl-4 col-lg-4 col-md-6">
                                                <div className="education_block_grid border">
                                                    <div className="education-thumb position-relative">
                                                        <a href="course-detail.html">
                                                            <img
                                                                src={`${appUrl}/assets/img/courses-3.jpg`}
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
                                                        <div className="progress-info mt-3">
                                                            {/* Title with info */}
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h6 className="text-mid fw-normal">
                                                                    12 of 12 lessons complete
                                                                </h6>
                                                                <h6 className="fw-semibold">100%</h6>
                                                            </div>
                                                            <div className="d-flex">
                                                                <div
                                                                    className="progress w-100"
                                                                    role="progressbar"
                                                                    aria-label="Success striped example"
                                                                    aria-valuenow={100}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                    style={{ height: 8 }}
                                                                >
                                                                    <div
                                                                        className="progress-bar progress-bar-striped bg-success"
                                                                        style={{ width: "100%" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="education-footer border-0 p-3 pt-2">
                                                        <a
                                                        href="student-course-resume.html"
                                                        className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                                        >
                                                            Course Resume
                                                            <i className="bi bi-arrow-right ms-2" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Single Slide */}
                                            <div className="col-xl-4 col-lg-4 col-md-6">
                                                <div className="education_block_grid border">
                                                    <div className="education-thumb position-relative">
                                                        <a href="course-detail.html">
                                                            <img
                                                                src={`${appUrl}/assets/img/courses-4.jpg`}
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
                                                        <div className="progress-info mt-3">
                                                            {/* Title with info */}
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h6 className="text-mid fw-normal">
                                                                    7 of 18 lessons complete
                                                                </h6>
                                                                <h6 className="fw-semibold">40%</h6>
                                                            </div>
                                                            <div className="d-flex">
                                                                <div
                                                                    className="progress w-100"
                                                                    role="progressbar"
                                                                    aria-label="warning striped example"
                                                                    aria-valuenow={40}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={40}
                                                                    style={{ height: 8 }}
                                                                >
                                                                    <div
                                                                        className="progress-bar progress-bar-striped bg-warning"
                                                                        style={{ width: "40%" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="education-footer border-0 p-3 pt-2">
                                                        <a
                                                            href="student-course-resume.html"
                                                            className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                                        >
                                                            Course Resume
                                                            <i className="bi bi-arrow-right ms-2" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Single Slide */}
                                            <div className="col-xl-4 col-lg-4 col-md-6">
                                                <div className="education_block_grid border">
                                                    <div className="education-thumb position-relative">
                                                        <a href="course-detail.html">
                                                            <img
                                                                src={`${appUrl}/assets/img/courses-5.jpg`}
                                                                className="img-fluid"
                                                                alt=""
                                                            />
                                                        </a>
                                                        <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                                            <span className="badge bg-dark rounded-pill">
                                                                <i className="bi bi-clock-history me-1" />
                                                                12h 40m
                                                            </span>
                                                        </div>
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
                                                        <div className="progress-info mt-3">
                                                            {/* Title with info */}
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h6 className="text-mid fw-normal">
                                                                    17 of 17 lessons complete
                                                                </h6>
                                                                <h6 className="fw-semibold">100%</h6>
                                                            </div>
                                                            <div className="d-flex">
                                                                <div
                                                                    className="progress w-100"
                                                                    role="progressbar"
                                                                    aria-label="Success striped example"
                                                                    aria-valuenow={100}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                    style={{ height: 8 }}
                                                                >
                                                                    <div
                                                                        className="progress-bar progress-bar-striped bg-success"
                                                                        style={{ width: "100%" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="education-footer border-0 p-3 pt-2">
                                                        <a
                                                            href="student-course-resume.html"
                                                            className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                                        >
                                                            Course Resume
                                                            <i className="bi bi-arrow-right ms-2" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Single Slide */}
                                            <div className="col-xl-4 col-lg-4 col-md-6">
                                                <div className="education_block_grid border">
                                                    <div className="education-thumb position-relative">
                                                        <a href="course-detail.html">
                                                            <img
                                                                src={`${appUrl}/assets/img/courses-6.jpg`}
                                                                className="img-fluid"
                                                                alt=""
                                                            />
                                                        </a>
                                                        <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                                            <span className="badge bg-dark rounded-pill">
                                                                <i className="bi bi-clock-history me-1" />
                                                                17h 15m
                                                            </span>
                                                        </div>
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
                                                        <div className="progress-info mt-3">
                                                            {/* Title with info */}
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h6 className="text-mid fw-normal">
                                                                    6 of 10 lessons complete
                                                                </h6>
                                                                <h6 className="fw-semibold">60%</h6>
                                                            </div>
                                                            <div className="d-flex">
                                                                <div
                                                                    className="progress w-100"
                                                                    role="progressbar"
                                                                    aria-label="warning striped example"
                                                                    aria-valuenow={60}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={60}
                                                                    style={{ height: 8 }}
                                                                >
                                                                    <div
                                                                        className="progress-bar progress-bar-striped bg-warning"
                                                                        style={{ width: "60%" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="education-footer border-0 p-3 pt-2">
                                                        <a
                                                            href="student-course-resume.html"
                                                            className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                                        >
                                                            Course Resume
                                                            <i className="bi bi-arrow-right ms-2" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Single Slide */}
                                            <div className="col-xl-4 col-lg-4 col-md-6">
                                                <div className="education_block_grid border">
                                                    <div className="education-thumb position-relative">
                                                        <a href="course-detail.html">
                                                            <img
                                                                src={`${appUrl}/assets/img/courses-7.jpg`}
                                                                className="img-fluid"
                                                                alt=""
                                                            />
                                                        </a>
                                                        <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                                            <span className="badge bg-dark rounded-pill">
                                                                <i className="bi bi-clock-history me-1" />
                                                                14h 20m
                                                            </span>
                                                        </div>
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
                                                        <div className="progress-info mt-3">
                                                            {/* Title with info */}
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h6 className="text-mid fw-normal">
                                                                    32 of 32 lessons complete
                                                                </h6>
                                                                <h6 className="fw-semibold">100%</h6>
                                                            </div>
                                                            <div className="d-flex">
                                                                <div
                                                                    className="progress w-100"
                                                                    role="progressbar"
                                                                    aria-label="Success striped example"
                                                                    aria-valuenow={100}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                    style={{ height: 8 }}
                                                                >
                                                                    <div
                                                                        className="progress-bar progress-bar-striped bg-success"
                                                                        style={{ width: "100%" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="education-footer border-0 p-3 pt-2">
                                                        <a
                                                            href="student-course-resume.html"
                                                            className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                                        >
                                                            Course Resume
                                                            <i className="bi bi-arrow-right ms-2" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Single Slide */}
                                            <div className="col-xl-4 col-lg-4 col-md-6">
                                                <div className="education_block_grid border">
                                                    <div className="education-thumb position-relative">
                                                        <a href="course-detail.html">
                                                            <img
                                                                src={`${appUrl}/assets/img/courses-8.jpg`}
                                                                className="img-fluid"
                                                                alt=""
                                                            />
                                                        </a>
                                                        <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                                            <span className="badge bg-dark rounded-pill">
                                                                <i className="bi bi-clock-history me-1" />
                                                                22h 10m
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
                                                        <div className="progress-info mt-3">
                                                            {/* Title with info */}
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h6 className="text-mid fw-normal">
                                                                15 of 22 lessons complete
                                                                </h6>
                                                                <h6 className="fw-semibold">70%</h6>
                                                            </div>
                                                            <div className="d-flex">
                                                                <div
                                                                    className="progress w-100"
                                                                    role="progressbar"
                                                                    aria-label="warning striped example"
                                                                    aria-valuenow={70}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={70}
                                                                    style={{ height: 8 }}
                                                                >
                                                                    <div
                                                                        className="progress-bar progress-bar-striped bg-warning"
                                                                        style={{ width: "70%" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="education-footer border-0 p-3 pt-2">
                                                        <a
                                                            href="student-course-resume.html"
                                                            className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                                                        >
                                                            Course Resume
                                                            <i className="bi bi-arrow-right ms-2" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </>
    )
}
export default Dashboard