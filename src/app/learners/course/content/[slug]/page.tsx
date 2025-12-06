import Navbar from "@/src/components/dashboard/Navbar";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import { courseContentUrl, myCoursesUrl, studentDashboardUrl } from "@/src/utils/url";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Course Content - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const MyCourses = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <>    
            <Navbar />

            <div className="container-fluid py-4">
                {/* Top Section */}
                <div className="row align-items-center mb-4">
                    <div className="col">
                        <h1 className="fw-bold mb-0">Seller Financing Mastery</h1>
                        <p className="text-muted mb-0">Codie Sanchez</p>
                    </div>
                    <div className="col-auto text-end">
                        <p className="mb-0 text-muted small">Your Progress</p>
                        <h6 className="mb-0 fw-bold text-primary">0%</h6>
                        <small className="text-muted">0/8 completed</small>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="row g-4">
                    {/* Video Section */}
                    <div className="col-lg-8">
                        <div className="video-box rounded-4 d-flex flex-column justify-content-center align-items-center text-white">
                            <div className="text-center">
                                <i className="bi bi-camera-reels-fill fs-1 mb-3" />
                                <p className="mb-0 fs-5 fw-semibold">No video available</p>
                                <p className="mb-0">Invalid YouTube URL</p>
                            </div>
                        </div>
                        {/* Lesson Header */}
                        <div className="d-flex justify-content-between align-items-start mt-4">
                            <div>
                                <h2 className="fw-bold mb-1">What is Seller Financing?</h2>
                                <p className="text-muted mb-1">
                                    Module: Introduction to Seller Financing
                                </p>
                                <p className="text-muted">Understanding the fundamentals</p>
                            </div>
                            <span className="badge bg-light text-dark px-3 py-2 fs-6">10:00</span>
                        </div>
                    </div>
                    {/* Course Content Sidebar */}
                    <div className="col-lg-4">
                        <div className="bg-white rounded-4 p-4 shadow-sm">
                            <h5 className="fw-bold mb-0">Course Content</h5>
                            <p className="text-muted small mb-4">3 modules</p>
                            
                            <div className="course-scroll">
                                {/* MODULE 1 */}
                                <div className="mb-4">
                                    <button
                                        className="btn w-100 fw-semibold mb-2 px-0 d-flex justify-content-between align-items-center module-toggle"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#module1"
                                        aria-expanded="true"
                                    >
                                        Module 1: Introduction to Seller Financing &nbsp;&nbsp;
                                        <i className="bi bi-chevron-down toggle-arrow"></i>
                                    </button>
                                    <p className="text-muted small mb-2">0/3 completed</p>
                                    <div id="module1" className="collapse show">
                                        <div className="lesson-item p-3 mb-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">1</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        What is Seller Financing?
                                                    </p>
                                                    <span className="text-muted small">10:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lesson-item p-3 mb-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">2</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        Benefits for Buyers and Sellers
                                                    </p>
                                                    <span className="text-muted small">12:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lesson-item p-3 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">3</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">Common Misconceptions</p>
                                                    <span className="text-muted small">09:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* MODULE 2 (collapsed template) */}
                                <div className="mb-4 border-top">
                                    <button
                                        className="btn w-100 fw-semibold mb-2 px-0 d-flex justify-content-between align-items-center module-toggle"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#module2"
                                        aria-expanded="false"
                                    >
                                        Module 1: Introduction to Seller Financing &nbsp;&nbsp;
                                        <i className="bi bi-chevron-down toggle-arrow"></i>
                                    </button>
                                    <p className="text-muted small mb-2">0/3 completed</p>
                                    <div id="module2" className="collapse">
                                        <div className="lesson-item p-3 mb-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">1</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        What is Seller Financing?
                                                    </p>
                                                    <span className="text-muted small">10:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lesson-item p-3 mb-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">2</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        Benefits for Buyers and Sellers
                                                    </p>
                                                    <span className="text-muted small">12:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lesson-item p-3 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">3</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">Common Misconceptions</p>
                                                    <span className="text-muted small">09:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 border-top">
                                    <button
                                        className="btn w-100 fw-semibold mb-2 px-0 d-flex justify-content-between align-items-center module-toggle"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#module3"
                                        aria-expanded="false"
                                    >
                                        Module 1: Introduction to Seller Financing &nbsp;&nbsp;
                                        <i className="bi bi-chevron-down toggle-arrow"></i>
                                    </button>
                                    <p className="text-muted small mb-2">0/3 completed</p>
                                    <div id="module3" className="collapse">
                                        <div className="lesson-item p-3 mb-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">1</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        What is Seller Financing?
                                                    </p>
                                                    <span className="text-muted small">10:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lesson-item p-3 mb-2 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">2</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        Benefits for Buyers and Sellers
                                                    </p>
                                                    <span className="text-muted small">12:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lesson-item p-3 rounded-3">
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">3</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">Common Misconceptions</p>
                                                    <span className="text-muted small">09:00</span>
                                                </div>
                                                <div className="ms-auto">
                                                    <span className="lesson-dot" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    )
}
export default MyCourses