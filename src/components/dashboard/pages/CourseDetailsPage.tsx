'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuth } from "@/src/providers/AuthProvider";
import { myLecture } from "@/src/services/student/course";
import { useEffect, useState } from "react"
import Link from "next/link";
import { courseContentUrl } from "@/src/utils/url";
import { durationInHourMinutesAndSeconds } from '@/src/utils/client_functions';
import PageLoader from "../../website/PageLoader";
import CustomModal from "../../admin/CustomModal";

// Simple circular SVG progress indicator
const CircularProgress = ({
    percentage,
    size = 32,
    strokeWidth = 6,
}: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}) => {
    const clamped = Math.max(0, Math.min(percentage ?? 0, 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (clamped / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E2E8F0"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#38A169"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
        </svg>
    );
};

const totalCompletedLectures = (module: any) => {
    if (!module?.components || module.components.length === 0) return 0;

    return module.components.reduce((total: number, component: any) => {
        return total + (component.lectureStatus && component.lectureStatus === 'completed' ? 1 : 0);
    }, 0);
}

const CourseDetailsPage = ({courseId}: {courseId: string}) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [course, setCourse] = useState<any>(null);
    const [courseModuleData, setCourseModuleData] = useState<any[]>([]);
    const [showTelegramModal, setShowTelegramModal] = useState<boolean>(false);
    const [telegramLink, setTelegramLink] = useState<any>(null);
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const fetchLecture = async () => {
            try {
                setLoading(true);

                const result = await myLecture(userId, courseId);
                setCourse(result?.data?.course);
                setCourseModuleData(result?.data?.modulesAndComponents || []);

                if (result?.data?.course?.telegramLink) {
                    setShowTelegramModal(true);
                    setTelegramLink(result?.data?.course?.telegramLink);
                }
            }
            catch (error) {
                console.error('Error fetching course details:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchLecture();
    }, [user?.id, courseId]);

    return (
        <>
            <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="d-flex flex-column gap-3">
                    {loading ? <PageLoader /> : (
                        <>
                            <div className="accordion" id="accordionExample1">
                                <div className="accordion-item">
                                    <a
                                        className="accordion-header h3 d-flex flex-row justify-content-between align-items-center collapsible-link position-relative py-3 px-4 collapsed"
                                        data-bs-toggle="collapse"
                                        href="#collapseOne"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="collapseOne"
                                    >
                                        <div className="fw-semibold fs-5">
                                            {course?.title}
                                        </div>
                                    </a>
                                    <div
                                        id="collapseOne"
                                        className="accordion-collapse collapse show"
                                        data-bs-parent="#accordionExample1"
                                    >
                                        <div className="accordion-body border-top d-flex flex-column gap-3">
                                            {courseModuleData.length > 0 ? (
                                                courseModuleData.map((module: any, moduleIndex: number) => (
                                                    <div key={moduleIndex} className="accordion-html border rounded-2 py-3 ps-3">
                                                        <a
                                                            className="fs-6 fw-normal collapsible-link position-relative collapsed"
                                                            data-bs-toggle="collapse"
                                                            href={`#subtitle${moduleIndex}`}
                                                            role="button"
                                                            aria-expanded={moduleIndex === 0 ? 'true' : 'false'}
                                                            aria-controls={`subtitle${moduleIndex}`}
                                                        >
                                                            <div className="d-flex flex-row gap-3 align-items-center">
                                                                {(() => {
                                                                    const percentageCompleted = module.components && module.components.length > 0
                                                                        ? Math.round((totalCompletedLectures(module) / module.components.length) * 100)
                                                                        : 0;
                                                                    return (
                                                                        <>
                                                                            <span>
                                                                                <CircularProgress percentage={percentageCompleted} />
                                                                            </span>
                                                                        </>
                                                                    );
                                                                })()}
                                                                
                                                                {module.name}
                                                            </div>
                                                        </a>
                                                        <div
                                                            id={`subtitle${moduleIndex}`}
                                                            className={`accordion-collapse collapse ${moduleIndex === 0 ? 'show' : ''}`}
                                                        >
                                                            <div className="accordion-body mt-2 px-2 pb-0">
                                                                <ul className="d-flex flex-column gap-3 mb-0 px-0">
                                                                    {module.components.map((component: any) => (
                                                                        <li key={component.id} className="d-flex flex-row justify-content-between align-items-center">
                                                                            <div className="d-flex align-items-center flex-row gap-2">
                                                                                <Link href={`${courseContentUrl}/${course.id}?moduleId=${module.id}&componentId=${component.id}`} 
                                                                                    className={`square--30 circle ${component.lectureStatus && component.lectureStatus === 'completed' ? 'btn-green' : 'btn-light-red'}`}
                                                                                >
                                                                                    <i className="bi bi-play-fill fs-5" />
                                                                                </Link>
                                                                                <span className="d-inline-block text-truncate w-shrunk">
                                                                                    { component.name }
                                                                                </span>

                                                                                {component.lectureStatus && component.lectureStatus === 'completed' && (
                                                                                    <Link href={`${courseContentUrl}/${course.id}?moduleId=${module.id}&componentId=${component.id}`} className="badge bg-dark text-white">
                                                                                        Play again
                                                                                    </Link>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-mid text-muted">{durationInHourMinutesAndSeconds(component.duration || 30 )}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center p-5">
                                                    <img
                                                        src={`${appUrl}/assets/img/empty.svg`}
                                                        alt="Empty State"
                                                        className="img-fluid mb-4"
                                                        style={{ maxWidth: 260, opacity: "0.9" }}
                                                    />
                                                    <h4 className="fw-bold">No Course Content Yet</h4>

                                                    {course?.telegramLink ? (
                                                        <>
                                                            <p className="text-muted mb-4">
                                                                For now, the contents of this course are ONLY available on telegram, please check back later to take the course on your student portal.
                                                            </p>
                                                            <Link href={course?.telegramLink} target="_blank" className="btn btn-main px-4 py-2">Go to Telegram</Link>
                                                        </>
                                                    ) : (
                                                        <p className="text-muted mb-4">
                                                            The contents of this course is not available. Please contact support for complaints/assistance
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <CustomModal
                isOpen={showTelegramModal && telegramLink}
                title="Go To Telegram?"
                onClose={() => setShowTelegramModal(false)}
            >
                <div className="edu_wraper">
                    <div className="review-form-box form-submit">
                        <h3>Do you want to take this course on Telegram</h3>
                        <p>Some of our students prefer taking their courses on Telegram, would you also like to take your classes on Telegram?</p>
                        
                        <div className="d-flex" style={{gap: '20px'}}>
                            <button 
                                className="btn btn-main btn-md"
                                onClick={() => setShowTelegramModal(false)}
                            >
                                No
                            </button>

                            {telegramLink && (
                                <Link href={telegramLink} target="_blank" className="btn btn-green btn-md">Yes, go to Telegram</Link>
                            )}
                        </div>
                    </div>
                </div>
            </CustomModal>
        </>
    )
}
export default CourseDetailsPage