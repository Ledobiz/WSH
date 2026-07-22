'use client';

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useProgressCounts } from "@/src/providers/StudentSidebarProvider";
import { courseLectureIsCompleted, deleteLectureNote, editLectureNote, getLectureNotes, getUserProgressCounts, lectureIsComplete, myLecture, saveCourseReview, saveLectureNote } from "@/src/services/student/course";
import { toast } from "sonner";
import { 
    BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Download, File, FileSpreadsheet, 
    FileText, Menu, Play, StickyNote, X
} from "lucide-react";
import PageTransition from "@/src/components/PageTransition";
import { CoursePlayerSkeleton } from "@/src/components/learners/LMSSkeletons";
import EmptyState from "@/src/components/website/EmptyState";
import { studentDashboardUrl } from "@/src/utils/url";
import { useSmartBack } from "@/src/hooks/useSmartBack";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import CourseCompletionReview from "@/src/components/learners/CourseCompletionReview";
import { Progress } from "@/src/components/ui/progress";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import LessonNotes from "@/src/components/learners/LessonNotes";
import LectureSidebar from "@/src/components/learners/LectureSidebar";
import { durationInHourMinutesAndSeconds } from '@/src/utils/client_functions';
import VideoPlayer from "@/src/components/learners/VideoPlayer";

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    type: "video" | "file" | "pdf" | "word" | "spreadsheet";
    videoUrl?: string;
    bunnyVideoId?: string;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    completed: boolean;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface EnrolledCourse {
    id: string;
    slug: string;
    title: string;
    image: string;
    category: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    modules: Module[];
    lastAccessed?: string;
    telegramLink?: string;
}

export interface CourseNote {
    id: string;
    userId: string;
    courseId: string;
    studentModuleComponentId: string;
    note: string;
    createdAt: string;
    updatedAt: string;
}

export interface CourseReview {
    id: string;
    courseId: string;
    rating: number;
    text: string;
    anonymous: boolean;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

const iframeLectures = ['file', 'pdf'];
const docLectures = ['spreadsheet', 'word'];

const CourseLectureContent = ({courseId}: { courseId: string }) => {
    const { user } = useAuth();
    const searchParams = useSearchParams() ?? new URLSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const goBack = useSmartBack(studentDashboardUrl);
    const urlModuleId = searchParams.get('moduleId') || null;
    const urlComponentId = searchParams?.get('componentId') || null;

    const { setLecturesDone } = useProgressCounts();
    const [course, setCourse] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [lectures, setLectures] = useState<any[]>([]);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
    const [currentComponentId, setCurrentComponentId] = useState<string | null>(null);
    const [currentComponent, setCurrentComponent] = useState<any>(null);
    const [previousComponent, setPreviousComponent] = useState<any>(null);
    const [lectureLoading, setLectureLoading] = useState<boolean>(true);   
    const [nextComponent, setNextComponent] = useState<any>(null);
    const [previousModule, setPreviousModule] = useState<any>(null);
    const [nextModule, setNextModule] = useState<any>(null);
    const [totalCompletedLectures, setTotalCompletedLectures] = useState<number>(0);
    const [totalLectures, setTotalLectures] = useState<number>(0);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [notes, setNotes] = useState<CourseNote[]>([]);
    const [showNotes, setShowNotes] = useState(false);
    const [showCompletionReview, setShowCompletionReview] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [reviewDialogShown, setReviewDialogShown] = useState(false);
    

    // Prevent duplicate fetches (e.g., React Strict Mode) and loops from broad dependencies
    const lastFetchKeyRef = useRef<string | null>(null);
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
                setStudent(result?.data?.student || null);
                
                const completed = result?.data?.lecturesCompleted || 0;
                const total = result?.data?.totalLectures || 0;
                setTotalCompletedLectures(completed);
                setTotalLectures(total);
                // If course already complete on initial load, fire once (confetti only to avoid autoplay issues)
                if (total > 0 && completed === total) {
                    setShowReviewDialog(true);
                    setReviewDialogShown(true);
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

    // Load the student's saved notes for this course once it's known
    useEffect(() => {
        const userId = user?.id;
        if (!userId || !course?.id) return;

        const fetchNotes = async () => {
            const result = await getLectureNotes(userId, course.id);
            if (result.success) {
                setNotes((result.notes as unknown as CourseNote[]) || []);
            }
        };

        fetchNotes();
    }, [user?.id, course?.id]);

    useEffect(() => {
        const completed = new Set<string>();

        lectures.forEach((module: any) => {
            (module.components || []).forEach((component: any) => {
                if (component.lectureStatus === 'completed') {
                    completed.add(component.id);
                }
            });
        });

        setCompletedLessons(completed);
    }, [lectures]);

    useEffect(() => {
        if (!lectures.length || !currentComponent?.id) return;

        const mod = lectures.find((m) => m.components?.some((c: any) => c.id === currentComponent.id));
        if (!mod) return;

        setExpandedModules((prev) => (prev.includes(mod.id) ? prev : [...prev, mod.id]));
    }, [currentComponent?.id, lectures]);

    // Close notes on mobile when switching lessons
    useEffect(() => {
        if (window.innerWidth < 768) setShowNotes(false);
    }, [currentComponent?.id]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
        );
    };

    const markComplete = async () => {
        await markLectureAsComplete();
    };

    const handleReviewSubmit = async (reviewData: { rating: number; text: string; anonymous: boolean; images: string[] }) => {
        try {
            const userId = user?.id;
            if (!userId || !course?.id) return;

            await saveCourseReview(userId, course.id, student?.id, {
                rating: reviewData.rating,
                review: reviewData.text,
                anonymous: reviewData.anonymous,
            });

            setShowReviewDialog(false);
            setShowCompletionReview(false);
            toast.success('Thank you for submitting your review!');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.');
        }
    };

    const handleAddNote = async (content: string) => {
        const userId = user?.id;
        if (!userId || !course?.id) return;

        const noteToAdd = await saveLectureNote(userId, course.id, currentComponent?.id, content);

        if (noteToAdd.success) {
            setNotes((prev) => [
                ...prev,
                {
                    id: noteToAdd.note?.id || '',
                    userId,
                    courseId: course?.id || '',
                    studentModuleComponentId: currentComponent?.id || '',
                    note: content,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ]);

            toast.success(noteToAdd.message);
        }
        else {
            toast.error(noteToAdd.message);
        }
    };

    const handleEditNote = async (noteId: string, content: string) => {
        setNotes((prev) => prev.map((note) => note.id === noteId ? { ...note, note: content, updatedAt: new Date().toISOString() } : note));

        await editLectureNote(noteId, content);
    };

    const handleDeleteNote = async (noteId: string) => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));

        await deleteLectureNote(noteId);
    };

    const markLectureAsComplete = async () => {
        if (!currentModuleId || !currentComponentId) return;

        // Implementation for marking lecture as complete
        const result = await lectureIsComplete(currentModuleId, currentComponentId);

        if (result.success) {
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
            if (refreshedTotal > 0 && refreshedCompleted === refreshedTotal) {
                setShowCompletionReview(true);
                
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
                handleLectureNavigation(np.nextModule, np.nextComponent);
            }
        }
        else {
            toast.error(result.message || 'Failed to mark lecture as complete, please try again');            
        }
    }

    const showPreviousLecture = () => {
        if (!previousModule || !previousComponent) return;
        handleLectureNavigation(previousModule, previousComponent);
    }

    const showNextLecture = () => {
        if (!nextModule || !nextComponent) return;
        handleLectureNavigation(nextModule, nextComponent);
    }

    const handleLectureNavigation = (moduleId: string, componentId: string) => {
        if (!moduleId || !componentId) return;
        // Just update the URL; the useEffect watching URL params will handle the fetch
        updateUrlWithLecture(moduleId, componentId);
    }

    const currentLesson = currentComponent;
    
    const progress = totalLectures > 0 ? Math.round((totalCompletedLectures / totalLectures) * 100) : 0;
    
    const currentLessonNoteCount = notes.filter(
        (n) => n.courseId === course.id && n.studentModuleComponentId === currentLesson?.id
    ).length;

    const getTypeLabel = (type: string) => {
        const map: Record<string, string> = {
            video: "Video Lesson",
            file: "File",
            pdf: "PDF Document",
            word: "Word Document",
            spreadsheet: "Spreadsheet",
        };
        return map[type] || type;
    };

    const getTypeIcon = (type: string) => {
        const map: Record<string, React.ReactNode> = {
            video: <Play className="h-3 w-3" />,
            file: <File className="h-3 w-3" />,
            pdf: <FileText className="h-3 w-3" />,
            word: <File className="h-3 w-3" />,
            spreadsheet: <FileSpreadsheet className="h-3 w-3" />,
        };
        return map[type] || <FileText className="h-3 w-3" />;
    };

    if (lectureLoading) return <PageTransition><CoursePlayerSkeleton /></PageTransition>;

    if (!course) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <EmptyState icon={BookOpen} title="Course Not Found" description="This course doesn't exist or you haven't enrolled yet." actionLabel="Back to Dashboard" actionLink={studentDashboardUrl} />
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-background flex flex-col md:flex-row">
                {/* Mobile header */}
                <header className="sticky top-0 z-40 bg-background border-b border-border md:hidden">
                    <div className="flex items-center justify-between px-3 h-12">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
                            <Menu className="h-5 w-5 text-foreground" />
                        </button>
                        <p className="font-display font-bold text-xs text-foreground truncate mx-2 flex-1 text-center">
                            {currentComponent?.name}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className={`p-2 rounded-lg transition-colors relative ${showNotes ? "bg-accent/10 text-accent" : ""}`}
                            >
                                <StickyNote className="h-4 w-4" />
                                {currentLessonNoteCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                                        {currentLessonNoteCount}
                                    </span>
                                )}
                            </button>
                            <button onClick={goBack} className="p-2 cursor-pointer">
                                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                    <Progress value={progress} className="h-0.5 rounded-none" />
                </header>

                {/* Mobile sidebar overlay */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSidebarOpen(false)}
                                className="fixed inset-0 bg-foreground/50 z-50 md:hidden"
                            />
                            <motion.aside
                                initial={{ x: -300 }}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed left-0 top-0 bottom-0 w-75 bg-background z-50 md:hidden"
                            >
                                <div className="flex items-center justify-between p-3 border-b border-border">
                                    <span className="font-display font-bold text-sm text-foreground">Course Content</span>
                                    <button onClick={() => setSidebarOpen(false)}>
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>
                                <div className="h-[calc(100vh-49px)] overflow-hidden">
                                    <LectureSidebar 
                                        toggleModule={toggleModule}
                                        expandedModules={expandedModules}
                                        progress={progress}
                                        lectures={lectures}
                                        courseTitle={course?.title}
                                        activeComponentId={currentComponentId}
                                        onSelectLecture={(mId, cId) => {
                                            // Navigate and sync URL
                                            handleLectureNavigation(mId, cId);
                                        }}
                                    />
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Desktop sidebar */}
                <aside className="hidden md:block md:w-80 md:shrink-0 md:border-r md:border-border md:h-screen md:sticky md:top-0 md:overflow-y-auto">
                    <LectureSidebar 
                        toggleModule={toggleModule}
                        expandedModules={expandedModules}
                        progress={progress}
                        lectures={lectures}
                        courseTitle={course?.title}
                        activeComponentId={currentComponentId}
                        onSelectLecture={(mId, cId) => {
                            // Navigate and sync URL
                            handleLectureNavigation(mId, cId);
                        }}
                    />
                </aside>

                {/* Review dialog for completed courses without review */}
                <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="sr-only">Leave a Review</DialogTitle>
                            <DialogDescription className="sr-only">Share your feedback about this course</DialogDescription>
                        </DialogHeader>
                        <CourseCompletionReview
                            courseTitle={course.title}
                            onSubmit={handleReviewSubmit}
                        />
                    </DialogContent>
                </Dialog>

                {/* Main content */}
                <main className="flex-1 min-w-0">
                    {showCompletionReview ? (
                        <div className="max-w-4xl mx-auto p-4 md:p-8">
                            <CourseCompletionReview
                                courseTitle={course.title}
                                onSubmit={handleReviewSubmit}
                            />
                        </div>
                    ) : currentLesson ? (
                        <div className="max-w-4xl mx-auto p-4 md:p-8">
                            <motion.div
                                key={currentLesson.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4 md:space-y-6"
                            >
                                {/* Lesson metadata */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        {getTypeIcon(currentLesson.type)} {getTypeLabel(currentLesson.type)}
                                    </Badge>

                                    <span className="text-xs text-muted-foreground">{ durationInHourMinutesAndSeconds(currentLesson.duration || 30) }</span>

                                    {completedLessons.has(currentLesson.id) && (
                                        <Badge className="bg-success/10 text-success border-success/20 gap-1 text-xs">
                                            <CheckCircle2 className="h-3 w-3" /> Completed
                                        </Badge>
                                    )}

                                    {currentLesson.fileName && currentLesson.type !== "video" &&  (
                                        <a
                                            href={currentLesson.fileName}
                                            download={currentLesson.fileName}
                                            className="ml-auto"
                                        >
                                            <Button variant="outline" size="sm" className="gap-1 text-xs h-7">
                                                <Download className="h-3 w-3" /> Download
                                            </Button>
                                        </a>
                                    )}
                                </div>

                                <h1 className="text-lg md:text-2xl font-display font-bold text-foreground">
                                    {currentLesson.name}
                                </h1>

                                {/* VIDEO - Bunny Player fullscreen */}
                                {currentLesson.type === "video" && (
                                    <VideoPlayer
                                        key={currentLesson?.id ?? ''}
                                        videoId={currentLesson?.id ?? ''}
                                        isStudent={true}
                                        showFullscreenToggle={true}
                                    />
                                )}

                                {/* PDF/Old lecture types - Show download link instead of auto-embedding */}
                                {iframeLectures.includes(currentLesson.type) && currentLesson.fileName && (
                                    <div className="bg-card rounded-2xl border border-border p-6 md:p-10 text-center">
                                        <File className="h-12 w-12 text-primary mx-auto mb-4" />
                                        <h2 className="text-lg font-bold text-foreground mb-2">{currentLesson.fileName}</h2>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Click the button below to view or download this {currentLesson.type === 'pdf' ? 'PDF' : 'file'}.
                                        </p>
                                        <a href={currentLesson.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="hero" className="gap-2">
                                                <Download className="h-4 w-4" /> View {currentLesson.type === 'pdf' ? 'PDF' : 'File'}
                                            </Button>
                                        </a>
                                    </div>
                                )}

                                {/* Word document/Spreadsheet */}
                                {docLectures.includes(currentLesson.type) && currentLesson.fileName && (
                                    <div className="bg-card rounded-2xl border border-border p-6 md:p-10 text-center">
                                        {currentLesson.type === 'word' ? (
                                            <File className="h-12 w-12 text-primary mx-auto mb-4" />
                                        ) : (
                                            <FileSpreadsheet className="h-12 w-12 text-success mx-auto mb-4" />
                                        )}
                                        
                                        <h2 className="text-lg font-bold text-foreground mb-2">{currentLesson.fileName}</h2>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Download this {currentLesson.type === 'word' ? 'document' : 'spreadsheet'} to view its contents.
                                        </p>
                                        <a href={currentLesson.fileUrl} download={currentLesson.fileName}>
                                            <Button variant="hero" className="gap-2">
                                                <Download className="h-4 w-4" /> Download {currentLesson.type === 'word' ? 'Document' : 'Spreadsheet'}
                                            </Button>
                                        </a>
                                    </div>
                                )}

                                {/* Actions bar */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border">
                                    <div className="flex gap-2">
                                        {!completedLessons.has(currentLesson.id) && (
                                            <Button variant="hero" onClick={markComplete} className="gap-2 flex-1 sm:flex-none text-sm">
                                                <CheckCircle2 className="h-4 w-4" /> Mark Complete
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowNotes(!showNotes)}
                                            className={`gap-1.5 text-sm hidden md:flex ${showNotes ? "border-accent text-accent" : ""}`}
                                        >
                                            <StickyNote className="h-4 w-4" /> Notes
                                            {currentLessonNoteCount > 0 && (
                                                <span className="text-[10px] bg-accent/10 text-accent px-1.5 rounded-full font-bold">
                                                    {currentLessonNoteCount}
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="flex gap-2 sm:ml-auto">
                                        {previousComponent && (
                                            <Button variant="outline" size="sm" onClick={showPreviousLecture} className="gap-1 flex-1 sm:flex-none text-xs">
                                                <ChevronLeft className="h-4 w-4" /> Prev
                                            </Button>
                                        )}
                                        {nextComponent && (
                                            <Button variant="outline" size="sm" onClick={showNextLecture} className="gap-1 flex-1 sm:flex-none text-xs">
                                                Next <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Notes section */}
                                <AnimatePresence>
                                    {showNotes && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <LessonNotes
                                                notes={notes}
                                                courseId={course.id}
                                                lessonId={currentLesson.id}
                                                onAdd={handleAddNote}
                                                onEdit={handleEditNote}
                                                onDelete={handleDeleteNote}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    ) : null}
                </main>
            </div>
        </PageTransition>
    )
}
export default CourseLectureContent