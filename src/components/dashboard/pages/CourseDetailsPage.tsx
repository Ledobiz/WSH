'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuth } from "@/src/providers/AuthProvider";
import { myLecture } from "@/src/services/student/course";
import { useEffect, useState } from "react"
import Link from "next/link";
import { courseContentUrl } from "@/src/utils/url";
import { durationInHourMinutesAndSeconds } from '@/src/utils/client_functions';
import PageLoader from "../../website/PageLoader";

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

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const fetchLecture = async () => {
            try {
                setLoading(true);

                const result = await myLecture(userId, courseId);
                setCourse(result?.data?.course);
                setCourseModuleData(result?.data?.modulesAndComponents || []);
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
        <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="d-flex flex-column gap-3">
                {loading ? <PageLoader /> : (
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
                                    {courseModuleData.map((module: any, moduleIndex: number) => (
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
                                                                    <Link href={`${courseContentUrl}/${course.id}`} 
                                                                        className={`square--30 circle ${component.lectureStatus && component.lectureStatus === 'completed' ? 'btn-green' : 'btn-light-red'}`}
                                                                    >
                                                                        <i className="bi bi-play-fill fs-5" />
                                                                    </Link>
                                                                    <span className="d-inline-block text-truncate w-shrunk">
                                                                        { component.name }
                                                                    </span>

                                                                    {component.lectureStatus && component.lectureStatus === 'completed' && (
                                                                        <Link href={`${courseContentUrl}/${course.id}`} className="badge bg-dark text-white">
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
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default CourseDetailsPage