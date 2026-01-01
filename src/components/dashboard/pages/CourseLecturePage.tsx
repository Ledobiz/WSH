'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { lectureIsComplete, myLecture } from "@/src/services/student/course";
import LectureContentSidebar from "../LectureContentSidebar"
import VideoPlayer from "../VideoPlayer"
import { useAuth } from "@/src/providers/AuthProvider";
import { useEffect, useRef, useState } from "react";
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
    const [previousComponent, setPreviousComponent] = useState<any>(null);
    const [nextComponent, setNextComponent] = useState<any>(null);
    const [previousModule, setPreviousModule] = useState<any>(null);
    const [nextModule, setNextModule] = useState<any>(null);
    const [totalCompletedLectures, setTotalCompletedLectures] = useState<number>(0);
    const [totalLectures, setTotalLectures] = useState<number>(0);

    // Prevent duplicate fetches (e.g., React Strict Mode) and loops from broad dependencies
    const lastFetchKeyRef = useRef<string | null>(null);

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const key = `${userId}:${courseId}`;
        if (lastFetchKeyRef.current === key) return;
        lastFetchKeyRef.current = key;

        const fetchLecture = async () => {
            try {
                setLectureLoading(true);
                const result = await myLecture(userId, courseId);
                setCourse(result?.data?.course);
                setLectures(result?.data?.modulesAndComponents || []);
                setCurrentModuleId(result?.data?.currentModuleId || null);
                setCurrentComponentId(result?.data?.currentComponentId || null);
                setCurrentComponent(result?.data?.currentComponent || null);
                setCurrentModuleData(result?.data?.currentModuleData || null);
                setStudent(result?.data?.student || null);
                setTotalCompletedLectures(result?.data?.lecturesCompleted || 0);
                setTotalLectures(result?.data?.totalLectures || 0);

                if (result?.data?.nextPrevious && 'previousComponent' in result.data.nextPrevious) {
                    setPreviousComponent(result.data.nextPrevious.previousComponent || null);
                    setNextComponent(result.data.nextPrevious.nextComponent || null);
                    setPreviousModule(result.data.nextPrevious.previousModule || null);
                    setNextModule(result.data.nextPrevious.nextModule || null);
                } else {
                    setPreviousComponent(null);
                    setNextComponent(null);
                    setPreviousModule(null);
                    setNextModule(null);
                }
                setLectureLoading(false);
            } catch (error) {
                console.error('Error fetching lecture data:', error);
                toast.error('Failed to load lecture data. Please try again later.');
                setLectureLoading(false);
            }
        };

        fetchLecture();
    }, [courseId, user?.id]);

    const markLectureAsComplete = async () => {
        if (!currentModuleId || !currentComponentId) return;

        // Implementation for marking lecture as complete
        const result = await lectureIsComplete(currentModuleId, currentComponentId);

        if (result.success) {
            const nextLectureComponent = nextComponent;
            const nextLectureModule = nextModule;

            toast.success('Lecture marked as complete, you may proceed to the next lecture.');

            // Refresh the lecture data to reflect the change and enable Next
            const userId = user?.id;
            if (!userId) return;

            await handleLectureNavigation(nextLectureModule, nextLectureComponent);
        }
        else {
            toast.error(result.message || 'Failed to mark lecture as complete, please try again');            
        }
    }

    const showPreviousLecture = async () => {
        if (!previousModule || !previousComponent) return;

        // Refresh the lecture data to reflect the change and load the next lecture
        if (previousComponent && previousModule) {
            handleLectureNavigation(previousModule, previousComponent);
        }
    }

    const showNextLecture = async () => {
        if (!nextModule || !nextComponent) return;
        
        // Refresh the lecture data to reflect the change and load the next lecture
        handleLectureNavigation(nextModule, nextComponent);
    }

    const handleLectureNavigation = async (moduleId: string, componentId: string) => {
        const userId = user?.id;
        if (!userId || !moduleId || !componentId) return;

        const result = await myLecture(userId, courseId, moduleId, componentId);

        setCourse(result?.data?.course);
        setLectures(result?.data?.modulesAndComponents || []);
        setCurrentModuleId(result?.data?.currentModuleId || null);
        setCurrentComponentId(result?.data?.currentComponentId || null);
        setCurrentComponent(result?.data?.currentComponent || null);
        setCurrentModuleData(result?.data?.currentModuleData || null);
        setStudent(result?.data?.student || null);
        setTotalCompletedLectures(result?.data?.lecturesCompleted || 0);
        setTotalLectures(result?.data?.totalLectures || 0);

        if (result?.data?.nextPrevious && 'previousComponent' in result.data.nextPrevious) {
            setPreviousComponent(result.data.nextPrevious.previousComponent || null);
            setNextComponent(result.data.nextPrevious.nextComponent || null);
            setPreviousModule(result.data.nextPrevious.previousModule || null);
            setNextModule(result.data.nextPrevious.nextModule || null);
        } else {
            setPreviousComponent(null);
            setNextComponent(null);
            setPreviousModule(null);
            setNextModule(null);
        }
    }
    
    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            <div className="row align-items-center mb-4">
                <div className="col">
                    <h1 className="fw-bold mb-0">{ course?.title }</h1>
                    {/* <p className="text-muted mb-0">Codie Sanchez</p> */}
                </div>
                <div className="col-auto text-end">
                    <h4 className="mb-0 text-muted">Your Progress</h4>
                    <h5 className="mb-0 fw-bold text-primary">{totalLectures > 0 ? ((totalCompletedLectures / totalLectures) * 100).toFixed() : 0}%</h5>
                    <p className="text-muted">{totalCompletedLectures}/{totalLectures} completed</p>
                </div>
            </div>

            <div className="progress" style={{height: '7px'}}>
                <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{width: `${totalLectures > 0 ? ((totalCompletedLectures / totalLectures) * 100) : 0}%`}}
                    aria-valuenow={totalLectures > 0 ? ((totalCompletedLectures / totalLectures) * 100) : 0}
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
                                {currentComponent?.lectureStatus !== 'completed' && (
                                    <button className="btn btn-main px-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={markLectureAsComplete}
                                    >
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
                                )}
                                
                                <button
                                    className="btn btn-light text-secondary px-2 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                                    disabled={!previousComponent}
                                    style={{cursor: 'not-allowed'}}
                                    onClick={showPreviousLecture}
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
                                    disabled={!nextComponent || currentComponent?.lectureStatus !== 'completed'}
                                    onClick={showNextLecture}
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

                <LectureContentSidebar lectures={lectures}/>
            </div>
        </div>
    )
}
export default CourseLecturePage