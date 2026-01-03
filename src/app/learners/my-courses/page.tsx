'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import Navbar from "@/src/components/dashboard/Navbar";
import NavBreadcrumb from "@/src/components/dashboard/NavBreadcrumb";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import PageLoader from "@/src/components/website/PageLoader";
import { useAuth } from "@/src/providers/AuthProvider";
import { ongoingCourses } from "@/src/services/student/course";
import { coursesUrl, courseDetailUrl } from "@/src/utils/url";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Suspense, useEffect, useState } from "react"
import { formatDate } from "@/src/utils/client_functions";

type DBStudentInterface = Prisma.StudentGetPayload<{
    include: {
        course: true;
        studentModules: {
            include: {
                studentModuleComponents: true;
            };
        };
    };
}>;

const MyCourses = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // States
    const [myCourses, setMyCourses] = useState<DBStudentInterface[]>([]);
    const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCoursesAndProgress = async () => {
            // Fetch courses and progress data here
            if (!user?.id) return;

            setLoadingCourses(true);

            try {
                const result = await ongoingCourses(user.id);
                setMyCourses(result.courses);
            } catch (error) {
                console.log('Error fetching courses:', error);
            }
            finally {
                setLoadingCourses(false);
            }
        }

        fetchCoursesAndProgress();
    }, [user?.id]);

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
                                { loadingCourses ? <PageLoader /> : (
                                    myCourses.length > 0 ? (
                                        <>
                                            {/* Show ongoing/new courses only when there are unfinished courses */}
                                            {myCourses.filter(student => !student.lecturesCompleted).length > 0 && (
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
                                                            {myCourses.filter(student => !student.lecturesCompleted).map((student) => (
                                                                <div key={student.id} className="col-xl-4 col-lg-4 col-md-6">
                                                                    <div className="education_block_grid border">
                                                                        <div className="education-thumb position-relative">
                                                                            <Link href={`${courseDetailUrl}/${student.course.id}`}>
                                                                                <img src={student.course.thumbnail ?? ''} className="img-fluid" alt={student.course.title} />
                                                                            </Link>
                                                                            <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                                                                <span className="badge bg-dark rounded-pill"><i className="bi bi-clock-history me-1"></i>{formatDate(student.createdAt)}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="education-body p-3">
                                                                            <div className="education-title">
                                                                                <h4 className="fs-6 fw-medium text-dark">
                                                                                    <Link href={`${courseDetailUrl}/${student.course.id}`} className="text-dark">
                                                                                        {student.course.title}
                                                                                    </Link>
                                                                                </h4>
                                                                            </div>

                                                                            {student.course.seoDescription && (
                                                                                <div className="progress-info mt-3">
                                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                                        <h6 className="text-mid fw-normal text-dark">
                                                                                            {student.course.seoDescription}
                                                                                        </h6>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="education-footer border-0 p-3 pt-2">
                                                                            <Link
                                                                                href={`${courseDetailUrl}/${student.course.id}`}
                                                                                className="btn btn-md btn-outline-gray text-dark border-2 rounded-pill w-100"
                                                                            >
                                                                                Resume Lectures
                                                                                <i className="bi bi-arrow-right ms-2" />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        
                                            {myCourses.filter(student => student.lecturesCompleted).length > 0 && (
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
                                                            {myCourses.filter(student => student.lecturesCompleted).map((student) => (
                                                                <div key={student.id} className="col-xl-4 col-lg-4 col-md-6">
                                                                    <div className="education_block_grid border">
                                                                        <div className="education-thumb position-relative">
                                                                            <Link href={`${courseDetailUrl}/${student.course.id}`}>
                                                                                <img src={student.course.thumbnail ?? ''} className="img-fluid" alt={student.course.title} />
                                                                            </Link>

                                                                            <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                                                                                <span className="badge bg-dark rounded-pill"><i className="bi bi-clock-history me-1"></i>{formatDate(student.createdAt)}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="education-body p-3">
                                                                            <div className="education-title">
                                                                                <h4 className="fs-6 fw-medium text-dark">
                                                                                    <Link href={`${courseDetailUrl}/${student.course.id}`} className="text-dark">
                                                                                        {student.course.title}
                                                                                    </Link>
                                                                                </h4>
                                                                            </div>

                                                                            {student.course.seoDescription && (
                                                                                <div className="progress-info mt-3">
                                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                                        <h6 className="text-mid fw-normal text-dark">
                                                                                            {student.course.seoDescription}
                                                                                        </h6>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="education-footer border-0 p-3 pt-2">
                                                                            <Link
                                                                                href={`${courseDetailUrl}/${student.course.id}`}
                                                                                className="btn btn-md btn-outline-gray text-dark border-2 rounded-pill w-100"
                                                                            >
                                                                                Course Details
                                                                                <i className="bi bi-arrow-right ms-2" />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="row mb-4">
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="text-center p-5">
                                                    <img
                                                        src={`${appUrl}/assets/img/empty.svg`}
                                                        alt="Empty State"
                                                        className="img-fluid mb-4"
                                                        style={{ maxWidth: 260, opacity: "0.9" }}
                                                    />
                                                    <h4 className="fw-bold">No Active Courses Yet</h4>
                                                    <p className="text-muted mb-4">
                                                        Start your learning journey by exploring our available courses.
                                                    </p>
                                                    <Link href={coursesUrl} className="btn btn-main px-4 py-2">Browse Courses</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
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