'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoreVertical, Calendar, Loader2, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { getStudentCourses, assignCourseToStudent } from "@/src/services/admin/student";
import { removeStudentFromCourse, giveStudentNewlyAvailableLectureContents } from "@/src/services/student/course";
import { courseProgress } from "@/src/utils/progress_functions";
import { adminStudentsUrl } from "@/src/utils/url";
import { useSmartBack } from "@/src/hooks/useSmartBack";

const AdminStudentCourses = ({ userId }: { userId: string }) => {
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState<any[]>([]);
    const [otherCourses, setOtherCourses] = useState<any[]>([]);
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [unenrollTarget, setUnenrollTarget] = useState<{ courseId: string; title: string } | null>(null);
    const [refreshTarget, setRefreshTarget] = useState<{ courseId: string; title: string } | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);
    const goBack = useSmartBack(adminStudentsUrl);

    const load = async () => {
        const result = await getStudentCourses(userId);
        const courses = result.courses || [];
        setEnrolled(courses);
        setOtherCourses(result.otherCourses || []);

        const progressMap: Record<string, number> = {};
        await Promise.all(courses.map(async (student: any) => {
            const p = await courseProgress(userId, student.course.id);
            progressMap[student.course.id] = p.totalLectures > 0
                ? Math.round((p.lecturesCompleted / p.totalLectures) * 100)
                : 0;
        }));
        setProgress(progressMap);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await load();
            } catch (error) {
                console.log("Error loading student courses:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [userId]);

    const handleUnenroll = async () => {
        if (!unenrollTarget) return;
        const result = await removeStudentFromCourse(userId, unenrollTarget.courseId);
        if (result.success) {
            toast.success("Student unenrolled");
            await load();
        } else {
            toast.error(result.message);
        }
        setUnenrollTarget(null);
    };

    const handleRefresh = async () => {
        if (!refreshTarget) return;
        setRefreshing(true);
        try {
            const result = await giveStudentNewlyAvailableLectureContents(userId, refreshTarget.courseId);
            if (result.success) {
                toast.success("Course content refreshed. The student now has the latest lectures.");
                await load();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log("Error refreshing course content:", error);
            toast.error("Failed to refresh course content. Please try again.");
        } finally {
            setRefreshing(false);
            setRefreshTarget(null);
        }
    };

    const handleEnroll = async (courseId: string) => {
        setEnrollingId(courseId);
        try {
            const result = await assignCourseToStudent(userId, courseId);
            if (result.success) {
                toast.success(result.message);
                await load();
            } else {
                toast.error(result.message);
            }
        } finally {
            setEnrollingId(null);
        }
    };

    const completedCount = enrolled.filter((s) => progress[s.course.id] === 100).length;
    const inProgressCount = enrolled.filter((s) => progress[s.course.id] > 0 && progress[s.course.id] < 100).length;
    const notStartedCount = enrolled.filter((s) => !progress[s.course.id]).length;

    return (
        <>
            <AdminHeader title="Student Courses" />

            <div className="p-4 md:p-8">
                <Button variant="ghost" size="sm" className="mb-4 cursor-pointer" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {[
                                { label: "Completed", value: completedCount },
                                { label: "In Progress", value: inProgressCount },
                                { label: "Not Started", value: notStartedCount },
                            ].map((s) => (
                                <div key={s.label} className="bg-background rounded-2xl p-4 border border-border">
                                    <p className="text-sm text-muted-foreground mb-2">{s.label}</p>
                                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Enrolled courses */}
                        <h2 className="text-lg font-semibold text-foreground mb-3">Enrolled Courses ({enrolled.length})</h2>
                        {enrolled.length === 0 ? (
                            <div className="bg-background rounded-2xl p-8 border border-border text-center text-muted-foreground mb-8">
                                No courses enrolled yet.
                            </div>
                        ) : (
                            <div className="space-y-3 mb-8">
                                {enrolled.map((student) => {
                                    const course = student.course;
                                    return (
                                        <div key={student.id} className="bg-background rounded-2xl border border-border p-4">
                                            <div className="flex gap-4">
                                                <img src={course.thumbnail || ""} alt={course.title} className="w-20 h-20 rounded-lg object-cover shrink-0 bg-muted" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 cursor-pointer"><MoreVertical className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                                    <Link href={`${adminStudentsUrl}/${userId}/courses/${course.id}/content`}>View Course Content</Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="cursor-pointer" onClick={() => setRefreshTarget({ courseId: course.id, title: course.title })}>
                                                                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh Course Content
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => setUnenrollTarget({ courseId: course.id, title: course.title })}>
                                                                    Unenroll Student
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <div className="space-y-1 mb-2">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">Progress</span>
                                                            <span className="font-medium text-foreground">{progress[course.id] ?? 0}%</span>
                                                        </div>
                                                        <Progress value={progress[course.id] ?? 0} className="h-2" />
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Enrolled: {new Date(student.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Enroll into more */}
                        {otherCourses.length > 0 && (
                            <>
                                <h2 className="text-lg font-semibold text-foreground mb-3">Enroll in More Courses</h2>
                                <div className="space-y-3">
                                    {otherCourses.map((course) => (
                                        <div key={course.id} className="bg-background rounded-2xl border border-border p-4 flex items-center gap-3">
                                            <img src={course.thumbnail || ""} alt={course.title} className="w-12 h-12 rounded-lg object-cover shrink-0 bg-muted" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-foreground truncate">{course.title}</p>
                                                <p className="text-xs text-muted-foreground">{course.isFree ? "Free" : `₦${course.discountedFee.toLocaleString()}`}</p>
                                            </div>
                                            <Button size="sm" onClick={() => handleEnroll(course.id)} disabled={enrollingId === course.id} className="shrink-0 cursor-pointer">
                                                {enrollingId === course.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Enroll</>}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <AlertDialog open={!!refreshTarget} onOpenChange={(open) => !open && !refreshing && setRefreshTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Refresh Course Content?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This gives the student any new modules and lectures added to &quot;{refreshTarget?.title}&quot; since they enrolled, and updates existing ones. Their progress is preserved. Continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={refreshing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleRefresh(); }}
                            disabled={refreshing}
                        >
                            {refreshing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Refreshing...</> : "Refresh Content"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!unenrollTarget} onOpenChange={(open) => !open && setUnenrollTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unenroll Student?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Unenroll this student from &quot;{unenrollTarget?.title}&quot;? They will lose access to the course and its progress.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnenroll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Unenroll</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminStudentCourses;
