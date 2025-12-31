'use client'

import Navbar from "@/src/components/dashboard/Navbar";
import NavBreadcrumb from "@/src/components/dashboard/NavBreadcrumb";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading";
import { Prisma } from "@prisma/client";
import { useAuth } from "@/src/providers/AuthProvider";
import { useProgressCounts } from "@/src/providers/StudentSidebarProvider";
import { ongoingCourses } from "@/src/services/student/course";
import { courseContentUrl, coursesUrl } from "@/src/utils/url";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react"
import { durationInHourMinutesAndSeconds } from "@/src/utils/client_functions";

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

const totalActiveCourses = (courses: DBStudentInterface[]): number => {
    if (!courses.length) return 0;
    return courses.reduce((total, student) => {
        return total + (student.lecturesCompleted ? 1 : 0);
    }, 0);
}

const getTotalLectures = (course: DBStudentInterface): number => {
    if (!course.studentModules) return 0;
    return course.studentModules.reduce((total, module) => {
        return total + (module.studentModuleComponents?.length || 0);
    }, 0);
};

const totalDuration = (course: DBStudentInterface): number => {
    if (!course.course) return 30;

    return course.studentModules.reduce((total, module) => {
        return total + (module?.totalDuration || 0);
    }, 0);
};

const DashboardPage = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const [allCourses, setAllCourses] = useState<DBStudentInterface[] | null>(null);
    const [certificates, setCertificates] = useState(0);

    const { lecturesDone } = useProgressCounts();
    const { user } = useAuth();

    useEffect(() => {
        const myCourses = async () => {
            if (!user) {
                return;
            }

            const enrolledCourses = await ongoingCourses(user.id);
            setAllCourses(enrolledCourses.courses);
        }

        myCourses();
    }, []);

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
                                            
                                            <span className="position-absolute top-0 end-0 m-3 fw-bold fs-4">
                                                { totalActiveCourses(allCourses ?? []) }
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
                                                    <i className="bi bi-book fs-4" />
                                                </div>
                                            </div>
                                            <h5 className="opacity-75 text-white mb-1">Active Courses</h5>
                                            <p className="opacity-75 mb-0">In progress</p>
                                            <div className="circle-bg" />
                                        </div>
                                    </div>
                                    
                                    <div className="col-12 col-sm-6 col-lg-3">
                                        <div
                                            className="stat-card position-relative shadow-lg text-white p-4 rounded-4"
                                            style={{ background: "linear-gradient(135deg, #b83aff, #7b38ff)" }}
                                        >
                                            <span className="position-absolute top-0 end-0 m-3 fw-bold fs-4">
                                                { lecturesDone}
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
                                                { certificates }
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

                                {allCourses?.length ? (
                                    <div className="row mb-4">
                                        <div className="col-12 mb-0">
                                            <div className="d-flex align-items-start justify-content-between gap-2 flex-column flex-sm-row">
                                                <div className="head-title">
                                                    <h4 className="mb-2 mb-sm-0">Continue Learning</h4>
                                                    <p className="text-muted mb-0">Pick up where you left off</p>
                                                </div>
                                            </div>
                                        </div>

                                        {allCourses?.filter(c => !c.lecturesCompleted).map((course) => (
                                            <div key={course.id} className="card border-0 hover shadow-sm mb-3 rounded-4 p-3">
                                                <Link href={`${courseContentUrl}/${course.course.id}`} className="row g-3 g-md-4 align-items-center">
                                                    <div className="col-12 col-xl-4 col-lg-4 col-md-4">
                                                        <div
                                                            className="rounded-3 p-3 bg-light d-flex align-items-center justify-content-center mx-auto mx-sm-0"
                                                            style={{
                                                                background: "linear-gradient(135deg, #dee8ff, #f3e8ff)"
                                                            }}
                                                        >
                                                            <img src={course.course.thumbnail ?? ''} alt="icon" style={{width: '100%', height: '200px'}} className="img-fluid" />
                                                        </div>
                                                    </div>

                                                    {/* Text column */}
                                                    <div className="col">
                                                        <h5 className="fw-bold mb-1">{course.course.title}</h5>

                                                        <div className="d-flex flex-wrap align-items-center text-muted small mb-2">
                                                            <i className="bi bi-journal-bookmark me-1" /> {getTotalLectures(course)} {getTotalLectures(course) > 1 ? 'lessons' : 'lesson'}
                                                            <span className="mx-2">•</span>
                                                            <i className="bi bi-clock me-1" /> { durationInHourMinutesAndSeconds(totalDuration(course)) }
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
                                        ))}
                                    </div>
                                ) : (
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
                                        <Link href={coursesUrl} className="btn btn-main px-4 py-2">Browse Courses</Link>
                                    </div>
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
export default DashboardPage