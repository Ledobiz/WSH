'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { myLecture } from "@/src/services/student/course";
import LectureContentSidebar from "../LectureContentSidebar"
import VideoPlayer from "../VideoPlayer"
import { useAuth } from "@/src/providers/AuthProvider";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { durationInHourMinutesAndSeconds } from "@/src/utils/client_functions";
import ButtonLoader from "../../admin/ButtonLoader";

const CourseLecturePage = ({ courseId }: { courseId: string }) => {
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [lectures, setLectures] = useState<any[]>([]);
    const [student, setStudent] = useState<any>(null);
    const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
    const [currentComponentId, setCurrentComponentId] = useState<string | null>(null);
    const [currentComponent, setCurrentComponent] = useState<any>(null);
    const [currentModuleData, setCurrentModuleData] = useState<any>(null);
    const [lectureLoading, setLectureLoading] = useState<boolean>(true);   

    useEffect(() => {
        const userId = user?.id;

        const fetchLecture = async () => {
            try {
                const result = await myLecture(userId, courseId);
                setCourse(result?.data?.course);
                setLectures(result?.data?.allComponents || []);
                setCurrentModuleId(result?.data?.currentModuleId || null);
                setCurrentComponentId(result?.data?.currentComponentId || null);
                setCurrentComponent(result?.data?.currentComponent || null);
                setCurrentModuleData(result?.data?.currentModuleData || null);
                setStudent(result?.data?.student || null);
                setLectureLoading(false);
            } catch (error) {
                console.error('Error fetching lecture data:', error);
                toast.error('Failed to load lecture data. Please try again later.');
                setLectureLoading(false);
            }
        }

        fetchLecture();
    }, [courseId, user]);
    
    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            <div className="row align-items-center mb-4">
                <div className="col">
                    <h1 className="fw-bold mb-0">{ course?.title }</h1>
                    {/* <p className="text-muted mb-0">Codie Sanchez</p> */}
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
                        {
                            lectureLoading ? (
                                <div className="video-box d-flex align-items-center justify-content-center">
                                    <ButtonLoader /> 
                                </div>
                            ) :
                            <div>
                                <VideoPlayer videoId={currentComponent?.id ?? ''} isStudent={true} />
                            </div>
                        }

                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h2 className="h4 fw-bold mb-2">
                                        { currentComponent?.name }
                                    </h2>
                                    <h5 className="text-muted mb-0">
                                        Module: { currentModuleData?.name }
                                    </h5>
                                </div>
                                <span className="badge bg-light text-dark px-3 py-2 fs-6">{ durationInHourMinutesAndSeconds(currentComponent?.duration) }</span>
                            </div>
                            
                            <p className="text-secondary"
                                dangerouslySetInnerHTML={{ __html: currentComponent?.description ?? '' }}
                            />
                            
                            <div className="d-flex flex-wrap gap-2 pt-3">
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
                    
                    <div className="card shadow-sm border rounded-4 p-4 mt-4">
                        <h3 className="fw-bold mb-3">About This Course</h3>
                        <div dangerouslySetInnerHTML={{ __html: course?.description ?? '' }}
                            className="text-secondary mb-4"
                        />
                    </div>
                </div>

                <LectureContentSidebar />
            </div>
        </div>
    )
}
export default CourseLecturePage