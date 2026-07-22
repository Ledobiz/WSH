'use client';

import { Prisma } from "@prisma/client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Search, BookOpen } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import EmptyState from "@/src/components/website/EmptyState";
import { CourseListSkeleton } from "@/src/components/learners/LMSSkeletons";
import TelegramChoiceModal from "@/src/components/learners/TelegramChoiceModal";

import DashboardHeader from "@/src/components/learners/DashboardHeader"
import Link from "next/link";
import { useAuth } from "@/src/providers/AuthProvider";
import { ongoingCourses } from "@/src/services/student/course";
import { courseDetailUrl, coursesUrl } from "@/src/utils/url";
import { courseProgress } from "@/src/utils/server_functions";
import { useRouter } from "next/navigation";

type DBStudentInterface = Prisma.StudentGetPayload<{
    include: {
        course: {
            include: {
                category: true;
            }
        },
        studentModules: {
            include: {
                studentModuleComponents: true;
            };
        };
    };
}>;

const getTotalLectures = (course: DBStudentInterface): number => {
    if (!course.studentModules) return 0;
    return course.studentModules.reduce((total, module) => {
        return total + (module.studentModuleComponents?.length || 0);
    }, 0);
};

const MyCourses = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");
    const [loading, setLoading] = useState(true);
    const [telegramCourse, setTelegramCourse] = useState<any>(null)
    const [myCourses, setMyCourses] = useState<DBStudentInterface[]>([]);
    const [progressData, setProgressData] = useState<Record<string, number>>({});
    
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchCoursesAndProgress = async () => {
            if (!user?.id) return;

            setLoading(true);

            try {
                const result = await ongoingCourses(user.id);

                const progress: Record<string, number> = {};
                
                for (const course of result.courses ?? []) {
                    const lectureProgress = await courseProgress(user.id, course.course.id);
                    const progressPercent =
                        lectureProgress.totalLectures > 0
                            ? (lectureProgress.lecturesCompleted / lectureProgress.totalLectures) * 100
                            : 0;
                    progress[course.course.id] = progressPercent;
                }

                setProgressData(progress);
                setMyCourses(result.courses);
            } catch (error) {
                console.log('Error fetching courses:', error);
                setProgressData({});
                setMyCourses([]);
            }
            finally {
                setLoading(false);
            }
        }

        fetchCoursesAndProgress();
    }, [user]);

    const filtered = myCourses.filter((c) => {
        const matchesSearch = c.course.title.toLowerCase().includes(search.toLowerCase());
        if (filter === "completed") return matchesSearch && c.lecturesCompleted;
        if (filter === "in-progress") return matchesSearch && !c.lecturesCompleted;
        return matchesSearch;
    });

    const handleCourseClick = (e: React.MouseEvent, course: any) => {
        if (course.telegramLink) {
            e.preventDefault();
            setTelegramCourse(course);
        }
    };

    return (
        <>
            <DashboardHeader title='My Courses' />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">My Courses</h1>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "in-progress", "completed"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                filter === f
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                                }`}
                            >
                                {f === "all" ? "All" : f === "in-progress" ? "In Progress" : "Completed"}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <CourseListSkeleton />
                ) : filtered.length === 0 ? (
                    search || filter !== "all" ? (
                        <EmptyState
                            icon={BookOpen}
                            title="No record found"
                            description="No courses match your filters"
                            actionLabel="Browse Courses"
                        />
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title="No Courses Yet"
                            description="You haven't enrolled in any courses. Start learning today!"
                            actionLabel="Browse Courses"
                            actionLink={coursesUrl}
                        />
                    )
                ) : (
                    <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                        {filtered.map((course, i) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={`${courseDetailUrl}/${course.course.id}`}
                                    onClick={(e) => handleCourseClick(e, course.course)}
                                    className="flex flex-col bg-background rounded-2xl border border-border overflow-hidden hover:shadow-card transition-shadow group h-full"
                                >
                                    <div className="relative shrink-0"> 
                                        <img src={course.course.thumbnail ?? ""} alt={course.course.title} className="w-full h-36 object-cover rounded-t-2xl" />
                                        {course.lecturesCompleted && (
                                            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                                                <Badge className="bg-success text-success-foreground border-0 gap-1 text-[10px] md:text-xs">
                                                    <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5" /> Completed
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 md:p-4 flex flex-col flex-1 min-w-0">
                                        <Badge variant="secondary" className="text-[10px] mb-1 md:mb-2 w-fit">{course.course.category.name}</Badge>
                                        <h3 className="font-semibold text-foreground text-xs md:text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {course.course.title}
                                        </h3>
                                        <div className="mt-auto pt-1.5 md:pt-2">
                                            <div className="flex items-center gap-3">
                                                <Progress value={progressData[course.course.id]} className="flex-1 h-1.5" />
                                                <span className="text-[10px] md:text-xs text-muted-foreground">{progressData[course.course.id]?.toFixed()}%</span>
                                            </div>
                                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                                                {getTotalLectures(course)} {getTotalLectures(course) > 1 ? 'lessons' : 'lesson'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {telegramCourse && (
                    <TelegramChoiceModal
                        open={!!telegramCourse}
                        onOpenChange={(open) => !open && setTelegramCourse(null)}
                        courseTitle={telegramCourse.title}
                        telegramLink={telegramCourse.telegramLink!}
                        onChooseLMS={() => {
                            setTelegramCourse(null);
                            router.push(`${courseDetailUrl}/${telegramCourse.id}`);
                        }}
                    />
                )}
            </div>
        </>
    )
}
export default MyCourses