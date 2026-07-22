'use client'

import { useEffect, useState } from "react";
import Link from "next/link";

import { Prisma } from "@prisma/client";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/src/components/learners/LMSSkeletons";
import EmptyState from "@/src/components/website/EmptyState";
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle2, ShoppingCart, Sparkles } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

import RequireCompleteProfile from "@/src/components/learners/RequireCompleteProfile";
import { useAuth } from "@/src/providers/AuthProvider";
import { ongoingCourses, recentlyAddedCourses } from "@/src/services/student/course";
import { cartUrl, courseDetailUrl, coursesUrl } from "@/src/utils/url";
import { courseProgress } from "@/src/utils/server_functions";
import { useCart } from "@/src/providers/CartProvider";
import { useRouter } from "next/navigation";
import TelegramChoiceModal from "@/src/components/learners/TelegramChoiceModal";
import DashboardHeader from "@/src/components/learners/DashboardHeader";

const totalActiveCourses = (courses: DBStudentInterface[]): number => {
    if (!courses.length) return 0;
    return courses.reduce((total, student) => {
        return total + (!student.lecturesCompleted ? 1 : 0);
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

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-2xl border border-border p-3 md:p-5"
    >
        <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-foreground truncate">{value}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate">{label}</p>
            </div>
        </div>
    </motion.div>
);

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

type TelegramCourse = {
    id: string;
    title?: string | null;
    telegramLink?: string | null;
};

const Dashboard = () => {
    const [telegramCourse, setTelegramCourse] = useState<TelegramCourse | null>(null);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [progressData, setProgressData] = useState<Record<string, number>>({}); // Store progress for each course
    const [courseCatalog, setCourseCatalog] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { user } = useAuth();
    const { addToCart, formatPrice } = useCart();

    const router = useRouter();

    useEffect(() => {
        const myCourses = async () => {
            if (!user) {
                return;
            }

            setLoading(true);
            
            try {
                const enrolledCourses = await ongoingCourses(user.id);

                const progress: Record<string, number> = {};

                for (const course of enrolledCourses.courses ?? []) {
                    const lectureProgress = await courseProgress(user.id, course.course.id);
                    const progressPercent =
                        lectureProgress.totalLectures > 0
                            ? (lectureProgress.lecturesCompleted / lectureProgress.totalLectures) * 100
                            : 0;
                    progress[course.course.id] = progressPercent;
                }

                setProgressData(progress);
                setAllCourses(enrolledCourses.courses);                
            } catch (error) {
                console.error("Error fetching courses:", error);
                setProgressData({});
                setAllCourses([]);
            } finally {
                setLoading(false);
            }

            try {
                const catalogs = await recentlyAddedCourses();
                setCourseCatalog(catalogs.courses);
            } catch (error) {
                setCourseCatalog([]);
            }
        }

        myCourses();
    }, [user]);

    const handleCourseClick = (e: React.MouseEvent, course: any) => {
        if (course.telegramLink) {
            e.preventDefault();
            setTelegramCourse(course);
        }
    };

    const buyNewCourse = async (course: any) => {
        await addToCart(course).then(() => {
            router.push(cartUrl);
        });
    }

    const dashboardTitle = <DashboardHeader title='Dashboard' />;

    if (loading) {
        return (
            <>
                {dashboardTitle}

                <div className="p-4 md:p-8">
                    <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Dashboard</h1>
                    <DashboardSkeleton />
                </div>
            </>
        );
    }

    if ((allCourses ?? []).length === 0) {
        return (
            <>
                {dashboardTitle}
                <EmptyState
                    icon={BookOpen}
                    title="No Courses Yet"
                    description="You haven't enrolled in any courses. Browse our catalog to get started!"
                    actionLabel="Browse Courses"
                    actionLink="/courses"
                />
            </>
        );
    }

    const totalCourses = allCourses.length;
    const completedCourses = allCourses.filter((c) => c.lecturesCompleted).length;
    const inProgressCourses = allCourses.filter((c) => !c.lecturesCompleted);
    const totalLessons = allCourses.reduce((sum, course) => sum + getTotalLectures(course), 0);
    const completedLessons = allCourses.reduce((s, student) => s + (student.lecturesCompleted ? 1 : 0), 0);

    const recentCourses = [...allCourses]
        .filter((c) => !c.lecturesCompleted)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Suggested courses: courses from catalog that the student hasn't enrolled in
    const enrolledSlugs = new Set(allCourses.map((c) => c.course.slug));
    const suggestedCourses = courseCatalog
        .filter((c) => !enrolledSlugs.has(c.slug))
        .slice(0, 4);

    return (
        <RequireCompleteProfile>
            {dashboardTitle}

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Dashboard</h1>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <StatCard icon={BookOpen} label="Enrolled Courses" value={String(totalCourses)} color="bg-primary/10 text-primary" />
                    <StatCard icon={CheckCircle2} label="Completed" value={String(completedCourses)} color="bg-success/10 text-success" />
                    <StatCard icon={TrendingUp} label="In Progress" value={String(inProgressCourses.length)} color="bg-accent/10 text-accent" />
                    <StatCard icon={Award} label="Lessons Done" value={`${completedLessons}/${totalLessons}`} color="bg-primary/10 text-primary" />
                </div>

                {recentCourses.length > 0 && (
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" /> Continue Learning
                        </h2>
                        <div className="space-y-3">
                            {recentCourses.map((course, i) => {
                                const nextLesson = course.lastLectureData?.name;

                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={`${courseDetailUrl}/${course.course.id}`}
                                            onClick={(e) => handleCourseClick(e, course.course)}
                                            className="flex gap-3 md:gap-4 bg-background rounded-2xl border border-border p-3 md:p-4 hover:shadow-card transition-shadow group cursor-pointer"
                                        >
                                            <img
                                                src={course.course.thumbnail}
                                                alt={course.course.title}
                                                className="w-14 h-14 md:w-20 md:h-16 rounded-xl object-cover shrink-0"
                                            />
                                            <div className="flex-1 min-w-0 overflow-hidden">
                                                <h3 className="font-semibold text-foreground text-xs md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                                                    {course.course.title}
                                                </h3>
                                                {nextLesson && (
                                                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                                                        <Play className="h-3 w-3 shrink-0" /> <span className="truncate">Last Lecture: {nextLesson}</span>
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 md:gap-3 mt-1.5 md:mt-2">
                                                    <Progress value={progressData[course.course.id]} className="flex-1 h-1.5 md:h-2" />
                                                    <span className="text-[10px] md:text-xs font-semibold text-primary shrink-0">{progressData[course.course.id]?.toFixed()}%</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mb-6 md:mb-8">
                    <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" /> All My Courses
                    </h2>
                    <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                        {allCourses.map((course, i) => (
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
                                        <img src={course.course.thumbnail} alt={course.course.title} className="w-full h-36 object-cover rounded-t-2xl" />
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
                </div>

                {/* Suggested Courses */}
                {suggestedCourses.length > 0 && (
                    <div>
                        <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-accent" /> You Might Also Like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {suggestedCourses.map((course, i) => (
                                <motion.div
                                    key={course.slug}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-background rounded-2xl border border-border overflow-hidden group flex flex-col h-full"
                                >
                                    <Link href={`${coursesUrl}/${course.slug}`} target="_blank" rel="noopener noreferrer">
                                        <img src={course.image} alt={course.title} className="w-full h-24 md:h-32 object-cover" />
                                    </Link>
                                    <div className="p-2.5 md:p-3 flex flex-col flex-1">
                                        <Badge variant="secondary" className="text-[10px] mb-1.5 w-fit">{course.category.name}</Badge>
                                        <Link href={`${coursesUrl}/${course.slug}`} target="_blank" rel="noopener noreferrer">
                                            <h3 className="font-semibold text-foreground text-[11px] md:text-xs leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2rem]">
                                                {course.title}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <div className="min-w-0">
                                                <span className="text-[10px] md:text-xs font-bold text-foreground">{ course.isFree ? 'Free' : formatPrice(course.discountedFee) }</span>
                                                <span className="text-[9px] md:text-[10px] text-muted-foreground line-through ml-1">{formatPrice(course.originalFee)}</span>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="text-[9px] md:text-[10px] h-6 md:h-7 gap-1 px-2 md:px-3 cursor-pointer"
                                                onClick={buyNewCourse}
                                            >
                                                <ShoppingCart className="h-3 w-3" /> <span className="hidden sm:inline">Add to</span> Cart
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
                {telegramCourse && (
                    <TelegramChoiceModal
                        open={!!telegramCourse}
                        onOpenChange={(open) => !open && setTelegramCourse(null)}
                        courseTitle={telegramCourse.title ?? ''}
                        telegramLink={telegramCourse?.telegramLink ?? ''}
                        onChooseLMS={() => {
                            setTelegramCourse(null);
                            router.push(`${courseDetailUrl}/${telegramCourse.id}`);
                        }}
                    />
                )}
            </div>
        </RequireCompleteProfile>
    )
}
export default Dashboard