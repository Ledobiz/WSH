import LectureContentSidebar from "@/src/components/dashboard/LectureContentSidebar";
import Navbar from "@/src/components/dashboard/Navbar";
import Sidebar from "@/src/components/dashboard/Sidebar";
import VideoPlayer from "@/src/components/dashboard/VideoPlayer";
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

            <section
                className="bg-cover p-0 d-none d-md-block"
                style={{ background: `url(${appUrl}/assets/img/student-bg.jpg)no-repeat` }}
                data-overlay={4}
            >
                <div className="container-fluid px-0">
                    <div className="ht-250" />
                </div>
            </section>

            <div className="container-fluid py-4">
                <div className="row gx-xl-5">
                    <Sidebar />

                    <div className="col-lg-9 col-md-12 col-sm-12">
                        {/* Top Section */}
                        <div className="row align-items-center mb-4">
                            <div className="col">
                                <h1 className="fw-bold mb-0">Seller Financing Mastery</h1>
                                <p className="text-muted mb-0">Codie Sanchez</p>
                            </div>
                            <div className="col-auto text-end">
                                <h4 className="mb-0 text-muted">Your Progress</h4>
                                <h5 className="mb-0 fw-bold text-primary">0%</h5>
                                <p className="text-muted">0/8 completed</p>
                            </div>
                        </div>

                        <div className="progress" style={{height: '7px'}}>
                            <div
                                className="progress-bar bg-success w-75"
                                role="progressbar"
                                aria-valuenow={75}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>

                        <hr className="my-4" />
                        <div className="row g-4">
                            <div className="col-lg-8">
                                <div className="card shadow-sm border rounded-4 overflow-hidden">
                                    <VideoPlayer videoId='https://www.youtube.com/watch?v=LXb3EKWsInQ'/>
                                    
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h2 className="h4 fw-bold mb-2">
                                                Benefits for Buyers and Sellers
                                                </h2>
                                                <h5 className="text-muted mb-0">
                                                Module: Introduction to Seller Financing
                                                </h5>
                                            </div>
                                            <span className="badge bg-light text-dark px-3 py-2 fs-6">10:00</span>
                                        </div>
                                        {/* Description */}
                                        <p className="text-secondary">Why seller financing is a win-win</p>
                                        {/* Buttons */}
                                        <div className="d-flex flex-wrap gap-2 pt-3">
                                            {/* Mark Complete */}
                                            <button className="btn btn-main px-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2">
                                                <svg
                                                width={20}
                                                height={20}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                >
                                                    <path
                                                        d="M5 13l4 4L19 7"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Mark as Complete
                                            </button>
                                            {/* Prev */}
                                            <button
                                                className="btn btn-light text-secondary px-2 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                                                disabled={true}
                                                style={{cursor: 'not-allowed'}}
                                            >
                                                <svg
                                                width={20}
                                                height={20}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                >
                                                <path
                                                    d="M15 19l-7-7 7-7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                </svg>
                                                <span className="d-none d-sm-inline">Previous</span>
                                            </button>
                                            {/* Next */}
                                            <button className="btn btn-light text-secondary px-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                                                style={{backgroundColor: '#f3f4f6'}}
                                            >
                                                <span className="d-none d-sm-inline">Next</span>
                                                <svg
                                                    width={20}
                                                    height={20}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                <path
                                                    d="M9 5l7 7-7 7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* ABOUT COURSE */}
                                <div className="card shadow-sm border rounded-4 p-4 mt-4">
                                    <h3 className="fw-bold mb-3">About This Course</h3>
                                    <p className="text-secondary mb-4">
                                        Master the art of seller financing to acquire businesses with
                                        minimal upfront capital. Learn proven strategies used by successful
                                        entrepreneurs to structure creative deals that benefit both buyers
                                        and sellers.
                                    </p>
                                    <h4 className="fw-bold mb-3">What You'll Learn</h4>
                                    <ul className="list-unstyled">
                                        <li className="d-flex gap-3 mb-2">
                                            <svg width={20} height={20} fill="#22c55e">
                                                <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z" />
                                            </svg>
                                            <span className="text-secondary">
                                                Understand the fundamentals of seller financing
                                            </span>
                                        </li>
                                        <li className="d-flex gap-3 mb-2">
                                            <svg width={20} height={20} fill="#22c55e">
                                                <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z" />
                                            </svg>
                                            <span className="text-secondary">
                                                Structure creative financing deals
                                            </span>
                                        </li>
                                        <li className="d-flex gap-3 mb-2">
                                            <svg width={20} height={20} fill="#22c55e">
                                                <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z" />
                                            </svg>
                                            <span className="text-secondary">
                                                Negotiate win-win terms with sellers
                                            </span>
                                        </li>
                                        <li className="d-flex gap-3 mb-2">
                                            <svg width={20} height={20} fill="#22c55e">
                                                <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z" />
                                            </svg>
                                            <span className="text-secondary">
                                                Minimize upfront capital requirements
                                            </span>
                                        </li>
                                        <li className="d-flex gap-3 mb-2">
                                            <svg width={20} height={20} fill="#22c55e">
                                                <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z" />
                                            </svg>
                                            <span className="text-secondary">
                                                Close deals with confidence
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <LectureContentSidebar />
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    )
}
export default MyCourses