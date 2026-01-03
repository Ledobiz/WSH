'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { lectureIsComplete, myLecture, getUserProgressCounts, courseLectureIsCompleted, saveCourseReview } from "@/src/services/student/course";
import LectureContentSidebar from "../LectureContentSidebar"
import VideoPlayer from "../VideoPlayer"
import { useAuth } from "@/src/providers/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { durationInHourMinutesAndSeconds } from "@/src/utils/client_functions";
import ButtonLoader from "../../admin/ButtonLoader";
import FileViewer from "../FileViewer";
import { useProgressCounts } from "@/src/providers/StudentSidebarProvider";
import confetti from 'canvas-confetti';
import ConfirmationModal from "../../ConfirmationModal";
import CelebrationModal from "../CelebrationModal";
import CustomModal from "../../admin/CustomModal";

const CourseLecturePage = ({ courseId }: { courseId: string }) => {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const urlModuleId = searchParams?.get('moduleId') || null;
    const urlComponentId = searchParams?.get('componentId') || null;
    
    const { setLecturesDone } = useProgressCounts();
    const [course, setCourse] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [lectures, setLectures] = useState<any[]>([]);
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
    const [displayConfirmation, setDisplayConfirmation] = useState<boolean>(false);
    const [showCelebration, setShowCelebration] = useState<boolean>(false);
    const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [review, setReview] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [anonymous, setAnonymous] = useState<boolean>(false);

    // Prevent duplicate fetches (e.g., React Strict Mode) and loops from broad dependencies
    const lastFetchKeyRef = useRef<string | null>(null);
    const confettiFiredRef = useRef<boolean>(false);
        const updateUrlWithLecture = (moduleId: string, componentId: string) => {
            if (!pathname) return;
            const params = new URLSearchParams(searchParams?.toString() || '');
            params.set('moduleId', moduleId);
            params.set('componentId', componentId);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        };

    const cheerAudioRef = useRef<HTMLAudioElement | null>(null);
    const congratsAudioRef = useRef<HTMLAudioElement | null>(null);

    const ensureAudioInit = () => {
        if (!cheerAudioRef.current) {
            const cheer = new Audio('/assets/audio/cheer.wav');
            cheer.preload = 'auto';
            cheer.volume = 0.8;
            cheerAudioRef.current = cheer;
        }
        if (!congratsAudioRef.current) {
            const congrats = new Audio('/assets/audio/congrat.mp3');
            congrats.preload = 'auto';
            congrats.volume = 0.95;
            congratsAudioRef.current = congrats;
        }
    };

    const playCelebrationAudio = () => {
        ensureAudioInit();
        const cheer = cheerAudioRef.current!;
        const congrats = congratsAudioRef.current!;

        // Show celebration banner while audio sequence runs
        setShowCelebration(true);

        // Chain playback: play congrats after cheer ends
        cheer.onended = () => {
            
        };

        try { congrats.play().catch(() => {}); } catch { /* noop */ }
        // Auto-close banner after second audio ends
        congrats.onended = () => setShowCelebration(false);

        // Safety: if cheer already unlocked/playing, restart from 0
        try {
            cheer.currentTime = 0;
            cheer.play().catch(() => {});
        } catch { /* noop */ }
    };

    const fireCompletionConfetti = () => {
        const duration = 15000;
        const animationEnd = Date.now() + duration;
        const colors = ['#ff3b3b', '#ffd43b', '#22c55e', '#3b82f6', '#a855f7'];

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = Math.max(20, Math.floor(60 * (timeLeft / duration)));

            // Launch two bursts from random positions for a fireworks feel
            confetti({
                particleCount,
                spread: 360,
                startVelocity: 35,
                ticks: 120,
                scalar: 1.2,
                gravity: 1,
                origin: {
                    x: randomInRange(0.1, 0.9),
                    y: randomInRange(0.1, 0.4)
                },
                colors,
            });

            confetti({
                particleCount,
                spread: 360,
                startVelocity: 35,
                ticks: 120,
                scalar: 1.2,
                gravity: 1,
                origin: {
                    x: randomInRange(0.1, 0.9),
                    y: randomInRange(0.1, 0.4)
                },
                colors,
            });
        }, 200);
    };

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const key = `${userId}:${courseId}:${urlModuleId ?? ''}:${urlComponentId ?? ''}`;
        if (lastFetchKeyRef.current === key) return;
        lastFetchKeyRef.current = key;

        const fetchLecture = async () => {
            try {
                setLectureLoading(true);
                const result = await myLecture(userId, courseId, urlModuleId ?? undefined, urlComponentId ?? undefined);
                setCourse(result?.data?.course);
                setLectures(result?.data?.modulesAndComponents || []);
                setCurrentModuleId(result?.data?.currentModuleId || null);
                setCurrentComponentId(result?.data?.currentComponentId || null);
                setCurrentComponent(result?.data?.currentComponent || null);
                setCurrentModuleData(result?.data?.currentModuleData || null);
                setStudent(result?.data?.student || null);
                
                const completed = result?.data?.lecturesCompleted || 0;
                const total = result?.data?.totalLectures || 0;
                setTotalCompletedLectures(completed);
                setTotalLectures(total);
                // If course already complete on initial load, fire once (confetti only to avoid autoplay issues)
                if (total > 0 && completed === total && !confettiFiredRef.current) {
                    fireCompletionConfetti();
                    setShowCelebration(true);
                    confettiFiredRef.current = true;
                } else if (completed < total) {
                    confettiFiredRef.current = false;
                }

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
    }, [courseId, user?.id, setLecturesDone, urlModuleId, urlComponentId]);

    // Cleanup audio handlers on unmount
    useEffect(() => {
        return () => {
            const c = cheerAudioRef.current;
            const g = congratsAudioRef.current;
            if (c) {
                c.onended = null;
                try { c.pause(); } catch {}
            }
            if (g) {
                g.onended = null;
                try { g.pause(); } catch {}
            }
        };
    }, []);

    const markLectureAsComplete = async () => {
        if (!currentModuleId || !currentComponentId) return;

        // Pre-unlock audio on user gesture before any awaits (autoplay policy)
        try {
            ensureAudioInit();
            const cheer = cheerAudioRef.current!;
            cheer.muted = true;
            await cheer.play().then(() => {
                cheer.pause();
                cheer.currentTime = 0;
                cheer.muted = false;
            }).catch(() => {});
        } catch { /* noop */ }

        // Implementation for marking lecture as complete
        const result = await lectureIsComplete(currentModuleId, currentComponentId);

        if (result.success) {
            setDisplayConfirmation(false);

            // Refetch to recompute next/previous based on updated completion,
            // then auto-navigate using refreshed pointers.
            const userId = user?.id;
            if (!userId) return;

            const refreshed = await myLecture(userId, courseId);
            setCourse(refreshed?.data?.course);
            setLectures(refreshed?.data?.modulesAndComponents || []);
            setCurrentModuleId(refreshed?.data?.currentModuleId || null);
            setCurrentComponentId(refreshed?.data?.currentComponentId || null);
            setCurrentComponent(refreshed?.data?.currentComponent || null);
            setCurrentModuleData(refreshed?.data?.currentModuleData || null);
            setStudent(refreshed?.data?.student || null);   
            
            const refreshedCompleted = refreshed?.data?.lecturesCompleted || 0;
            const refreshedTotal = refreshed?.data?.totalLectures || 0;
            setTotalCompletedLectures(refreshedCompleted);
            setTotalLectures(refreshedTotal);
            // Refresh global sidebar counts after completion
            const counts = await getUserProgressCounts(userId);
            if (counts?.success) {
                setLecturesDone(counts.data.lecturesCompletedCount);
            }
            // Fire confetti when course is fully completed
            if (refreshedTotal > 0 && refreshedCompleted === refreshedTotal && !confettiFiredRef.current) {
                fireCompletionConfetti();
                playCelebrationAudio();
                confettiFiredRef.current = true;
                
                await courseLectureIsCompleted(userId, courseId);
            }
            else {
                toast.success('Lecture marked as complete, you may proceed to the next lecture.');
            }

            if (refreshed?.data?.nextPrevious && 'previousComponent' in refreshed.data.nextPrevious) {
                setPreviousComponent(refreshed.data.nextPrevious.previousComponent || null);
                setNextComponent(refreshed.data.nextPrevious.nextComponent || null);
                setPreviousModule(refreshed.data.nextPrevious.previousModule || null);
                setNextModule(refreshed.data.nextPrevious.nextModule || null);
            } else {
                setPreviousComponent(null);
                setNextComponent(null);
                setPreviousModule(null);
                setNextModule(null);
            }

            const np = refreshed?.data?.nextPrevious;
            if (np && 'nextModule' in np && 'nextComponent' in np && np.nextModule && np.nextComponent) {
                await handleLectureNavigation(np.nextModule, np.nextComponent);
            }
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

        setLectureLoading(true);

        try {
            const result = await myLecture(userId, courseId, moduleId, componentId);

            setCourse(result?.data?.course);
            setLectures(result?.data?.modulesAndComponents || []);
            setCurrentModuleId(result?.data?.currentModuleId || null);
            setCurrentComponentId(result?.data?.currentComponentId || null);
            setCurrentComponent(result?.data?.currentComponent || null);
            setCurrentModuleData(result?.data?.currentModuleData || null);
            setStudent(result?.data?.student || null);
            
            const navCompleted = result?.data?.lecturesCompleted || 0;
            const navTotal = result?.data?.totalLectures || 0;
            setTotalCompletedLectures(navCompleted);
            setTotalLectures(navTotal);

            // Refresh global sidebar counts after navigation
            const counts = await getUserProgressCounts(userId);
            if (counts?.success) {
                setLecturesDone(counts.data.lecturesCompletedCount);
            }
            // Reset confetti flag if navigating within incomplete course
            if (navTotal > 0 && navCompleted < navTotal) {
                confettiFiredRef.current = false;
            }

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

            // Sync URL to reflect current module/component
            updateUrlWithLecture(moduleId, componentId);
        } 
        catch (error) {
            console.error('Error navigating to lecture:', error);
        }
        finally {
            setLectureLoading(false);
        }
    }

    const handleCelebrationModal = () => {
        setShowCelebration(false);

        if (student?.lecturesCompleted && !student?.submittedReview) {
            setShowRatingModal(true);
        }
    }

    const handleCourseRating = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || rating < 1) {
            toast.error('Please select a star rating.');
            return;
        }

        if (!review || review.trim().length === 0) {
            toast.error('Please provide a review.');
            return;
        }

        const reviewData = {
            rating,
            review,
            anonymous
        };

        try {
            setLoading(true);
            const userId = user?.id;
            if (!userId) return;

            // Save course review
            await saveCourseReview(userId, courseId, student?.id, reviewData);
            toast.success('Thank you for submitting your review! We appreciate your feedback');
            setShowRatingModal(false);
            setRating(0);
            setReview('');
            setAnonymous(false);
        }
        catch (error) {
            console.log('Error saving course review: ', error);
        }
        finally {
            setLoading(false);
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
                                {currentComponent?.type === 'video' &&
                                    <VideoPlayer
                                        key={currentComponent?.id ?? ''}
                                        videoId={currentComponent?.id ?? ''}
                                        isStudent={true}
                                    />
                                }

                                {currentComponent?.type !== 'video' && currentComponent?.fileName &&
                                    <FileViewer fileUrl={currentComponent?.fileName} />
                                }

                                {currentComponent?.type !== 'video' && !currentComponent?.fileName && 
                                    <div className="d-flex align-items-center justify-content-center p-4">
                                        <p className="text-muted mb-0">Lecture content is not available. Please reach out to support for resolution.</p>
                                    </div>
                                }
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
                                        onClick={() => setDisplayConfirmation(true)}
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

                <LectureContentSidebar
                    lectures={lectures}
                    activeModuleId={currentModuleId}
                    activeComponentId={currentComponentId}
                    onSelectLecture={(mId, cId) => {
                        // Navigate and sync URL
                        handleLectureNavigation(mId, cId);
                    }}
                />
            </div>

            <ConfirmationModal 
                isOpen={displayConfirmation}
                text="⚠️ Are you sure you want to mark this lecture as complete?"
                isForDelete={false}
                onClose={() => setDisplayConfirmation(false)}
                onConfirm={markLectureAsComplete}
            />

            <CelebrationModal
                isOpen={showCelebration}
                reviewSubmitted={student?.submittedReview}
                onClose={handleCelebrationModal}
                title="Congratulations!"
                message="You've completed this course. Great job!"
            />

            <CustomModal
                isOpen={showRatingModal}
                title='Submit Review'
                onClose={() => {}}
                closable={false}
            >
                <div className="edu_wraper">
                    <div className="review-form-box form-submit">
                        <form onSubmit={handleCourseRating}>
                            <div className="row g-3">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <label className="mb-2">What is the overall rating you believe this course deserves? <sup className="text-danger">*</sup></label>
                                        <div className="d-flex align-items-center gap-2">
                                            {[1,2,3,4,5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                                    onClick={() => setRating(star)}
                                                    className="btn p-0 border-0"
                                                    style={{
                                                        lineHeight: 1,
                                                        cursor: 'pointer',
                                                        background: 'transparent'
                                                    }}
                                                >
                                                    <svg width={28} height={28} viewBox="0 0 24 24" fill={star <= rating ? '#f59e0b' : 'none'} stroke={star <= rating ? '#f59e0b' : '#cbd5e1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8" />
                                                    </svg>
                                                </button>
                                            ))}
                                            <span className="ms-2 text-muted small">{rating}/5</span>
                                        </div>
                                        <input type="hidden" name="rating" value={rating} />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <label className="mb-2">Tell us why you think so <sup className="text-danger">*</sup></label>
                                        <textarea
                                            className="form-control ht-140"
                                            placeholder=""
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <label className="mb-2">Do you want to hide who you are?</label>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="anonymousCheck"
                                                checked={anonymous}
                                                onChange={(e) => setAnonymous(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="anonymousCheck">
                                                Yes, I want to submit this review anonymously.
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <button disabled={loading} type="submit" className="btn btn-main px-5">
                                            { loading ? <ButtonLoader /> : 'Submit Review' }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </CustomModal>
        </div>
    )
}
export default CourseLecturePage