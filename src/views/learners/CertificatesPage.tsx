'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

import DashboardHeader from "@/src/components/learners/DashboardHeader";
import EmptyState from "@/src/components/website/EmptyState";
import { CertificatesSkeleton } from "@/src/components/learners/LMSSkeletons";
import { useAuth } from "@/src/providers/AuthProvider";
import { ongoingCourses } from "@/src/services/student/course";
import { downloadCertificate } from "@/src/utils/certificate";

interface CompletedCourse {
    studentId: string;
    courseId: string;
    title: string;
    totalLessons: number;
    completedAt: string;
}

const CertificatesPage = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<CompletedCourse[]>([]);

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const fetchCompleted = async () => {
            setLoading(true);
            try {
                const result = await ongoingCourses(userId);
                const completed: CompletedCourse[] = (result.courses ?? [])
                    .filter((student: any) => student.lecturesCompleted)
                    .map((student: any) => ({
                        studentId: student.id,
                        courseId: student.course.id,
                        title: student.course.title,
                        totalLessons: (student.studentModules ?? []).reduce(
                            (total: number, m: any) => total + (m.studentModuleComponents?.length || 0),
                            0
                        ),
                        completedAt: student.updatedAt,
                    }));
                setCourses(completed);
            } catch (error) {
                console.log("Error fetching certificates:", error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompleted();
    }, [user?.id]);

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const handleDownload = (course: CompletedCourse) => {
        const studentName = user?.name?.trim();
        if (!studentName) {
            toast.error("Add your name in your profile before downloading a certificate.");
            return;
        }

        downloadCertificate({
            studentName,
            courseTitle: course.title,
            date: formatDate(course.completedAt),
            certificateId: course.studentId.slice(0, 8).toUpperCase(),
        });
        toast.success("Certificate downloaded!");
    };

    return (
        <>
            <DashboardHeader title="Certificates" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Certificates</h1>

                {loading ? (
                    <CertificatesSkeleton />
                ) : courses.length === 0 ? (
                    <EmptyState
                        icon={Award}
                        title="No Certificates Yet"
                        description="Complete a course to earn your certificate. Keep learning and you'll get there!"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course, i) => (
                            <motion.div
                                key={course.courseId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-background rounded-2xl border border-border p-5 flex gap-4"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Award className="h-7 w-7 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-sm line-clamp-2">{course.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Completed {formatDate(course.completedAt)} · {course.totalLessons} {course.totalLessons === 1 ? "lesson" : "lessons"}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(course)}
                                        className="mt-3 gap-1.5 text-xs h-8 cursor-pointer"
                                    >
                                        <Download className="h-3.5 w-3.5" /> Download Certificate
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CertificatesPage;
