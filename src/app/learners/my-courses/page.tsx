import Navbar from "@/src/components/dashboard/Navbar";
import NavBreadcrumb from "@/src/components/dashboard/NavBreadcrumb";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import { Metadata } from "next";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Student MyCourses - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const MyCourses = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <>    
            <Navbar />

            <section
                className="bg-cover p-0"
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
                            <NavBreadcrumb page="MyCourses" />
                            
                            <Suspense fallback={<Loading />}>
                                <div className="row mb-4">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                                            <div className="head-title">
                                                <h4 className="mb-2 mb-sm-0">Ongoing/New Courses</h4>
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
                                                            <img src={`${appUrl}/assets/img/co-1.jpg`} className="img-fluid" alt="" />
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
                                                                    UX/UI Design Essentials: Designing User-Centered Interfaces
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
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                                            <div className="head-title">
                                                <h4 className="mb-2 mb-sm-0">Completed Courses</h4>
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
                                                            <img src={`${appUrl}/assets/img/co-1.jpg`} className="img-fluid" alt="" />
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
                                                                    UX/UI Design Essentials: Designing User-Centered Interfaces
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
                                                            <img src={`${appUrl}/assets/img/co-4.jpg`} className="img-fluid" alt="" />
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
                                                                    Backend Development with Node.js: Building Scalable Web Apps
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
                                                            <img src={`${appUrl}/assets/img/co-5.jpg`} className="img-fluid" alt="" />
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
                                                                    Web Development Bootcamp: Learn to Build Modern Websites
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
                                                            <img src={`${appUrl}/assets/img/co-6.jpg`} className="img-fluid" alt="" />
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
                                                                    The Complete AI Guide: Learn ChatGPT, Generative AI &amp;
                                                                    More..
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
                                                            <img src={`${appUrl}/assets/img/co-7.jpg`} className="img-fluid" alt="" />
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
                                                                    Advanced WordPress Techniques: Dive Deep into Styling and
                                                                    Layout
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
export default MyCourses