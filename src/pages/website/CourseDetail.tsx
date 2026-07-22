'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, BarChart3, Monitor, Clock, CheckCircle2, ShoppingCart,
    Star, Users, BookX, Play, Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import EmptyState from "@/src/components/website/EmptyState";
import LoadingButton from "@/src/components/website/LoadingButton";
import CourseReviews from "@/src/components/website/CourseReviews";
import { useCart } from "@/src/providers/CartProvider";
import { singleCourseWebsite } from "@/src/services/website/course";
import { cartUrl, coursesUrl } from "@/src/utils/url";

const CourseDetailSkeleton = () => (
    <div className="bg-background">
        <section className="bg-primary py-10 md:py-16">
            <div className="container">
                <Skeleton className="h-5 w-32 mb-6 bg-primary-foreground/20" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-24 bg-primary-foreground/20" />
                        <Skeleton className="h-10 w-full bg-primary-foreground/20" />
                        <Skeleton className="h-10 w-3/4 bg-primary-foreground/20" />
                        <div className="flex gap-4">
                            <Skeleton className="h-5 w-20 bg-primary-foreground/20" />
                            <Skeleton className="h-5 w-20 bg-primary-foreground/20" />
                            <Skeleton className="h-5 w-20 bg-primary-foreground/20" />
                        </div>
                    </div>
                    <Skeleton className="h-64 w-full rounded-2xl bg-primary-foreground/20 hidden lg:block" />
                </div>
            </div>
        </section>
        <section className="py-10 md:py-16">
            <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
                <div>
                    <Skeleton className="h-72 w-full rounded-2xl" />
                </div>
            </div>
        </section>
    </div>
);

const CourseDetail = ({ slug }: { slug: string }) => {
    const router = useRouter();
    const { addToCart, cartCourses, loadingId, formatPrice } = useCart();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [rating, setRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 });

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const enrollBtnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);

        const fetchCourse = async () => {
            try {
                const result = await singleCourseWebsite(slug);
                if (!active) return;
                if (result.success && result.course) {
                    setCourse(result.course);
                    setRating(result.rating || { average: 0, count: 0 });
                } else {
                    setCourse(null);
                }
            } catch (error) {
                console.log("Error fetching course:", error);
                if (active) setCourse(null);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchCourse();
        return () => { active = false; };
    }, [slug]);

    useEffect(() => {
        if (loading) return;
        const el = enrollBtnRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setSidebarVisible(entry.isIntersecting),
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [loading, course]);

    if (loading) return <CourseDetailSkeleton />;

    if (!course) {
        return (
            <EmptyState
                icon={BookX}
                title="Course Not Found"
                description="The course you're looking for doesn't exist or has been removed."
                actionLabel="Browse Courses"
                actionLink={coursesUrl}
            />
        );
    }

    const isFree = course.isFree;
    const inCart = cartCourses.some((c) => c.id === course.id);
    const isAddingToCart = loadingId === course.id;
    const discountPercent = isFree
        ? 100
        : course.originalFee > 0
            ? Math.round(((course.originalFee - course.discountedFee) / course.originalFee) * 100)
            : 0;
    const studentsCount = course.students?.length ?? 0;

    const handleEnroll = async () => {
        if (inCart) {
            router.push(cartUrl);
            return;
        }
        await addToCart(course);
        toast.success(`${course.title} added to cart!`);
        router.push(cartUrl);
    };

    const whatYouWillLearn = [
        "Step-by-step practical demonstrations",
        "Business tips and monetization strategies",
        "Professional techniques and best practices",
        "Raw material sourcing guidance",
        "Costing and pricing strategies",
        ...(course.hasCertificate ? ["Certificate of completion"] : []),
    ];

    const sidebarFeatures = [
        { icon: Clock, label: "Lifetime access" },
        { icon: Monitor, label: "LMS / Telegram" },
        { icon: BarChart3, label: "Beginner level" },
        ...(course.hasCertificate ? [{ icon: CheckCircle2, label: "Certificate included" }] : []),
    ];

    return (
        <div className="bg-background">
            {/* Header */}
            <section className="bg-primary py-10 md:py-16">
                <div className="container">
                    <Link href={coursesUrl} className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Courses
                    </Link>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-primary-foreground space-y-4"
                        >
                            {course.category?.name && (
                                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 backdrop-blur-sm">
                                    {course.category.name}
                                </Badge>
                            )}
                            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{course.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4" /> Beginner</span>
                                <span className="flex items-center gap-1.5"><Monitor className="h-4 w-4" /> LMS / Telegram</span>
                                {rating.count > 0 && (
                                    <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" /> {rating.average.toFixed(1)} Rating</span>
                                )}
                                {studentsCount > 0 && (
                                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {studentsCount} {studentsCount === 1 ? "Student" : "Students"}</span>
                                )}
                            </div>
                        </motion.div>
                        {course.thumbnail && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="hidden lg:block"
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full max-w-xs ml-auto rounded-2xl shadow-lg"
                                    loading="eager"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10 md:py-16">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {course.thumbnail && (
                                <img src={course.thumbnail} alt={course.title} className="w-full rounded-2xl lg:hidden" loading="lazy" />
                            )}

                            {/* Preview Video */}
                            {course.previewVideo && (
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                                        <Play className="h-5 w-5 text-primary" /> Course Preview
                                    </h2>
                                    <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-sm">
                                        <iframe
                                            src={course.previewVideo}
                                            title={`${course.title} - Preview`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <h2 className="text-2xl font-bold text-foreground mb-4">About This Course</h2>
                                {course.description ? (
                                    <div
                                        className="prose-custom text-muted-foreground leading-relaxed max-w-none"
                                        dangerouslySetInnerHTML={{ __html: course.description }}
                                    />
                                ) : (
                                    <p className="text-muted-foreground leading-relaxed">
                                        This comprehensive course is designed to equip you with practical skills that you can immediately apply. Whether you&apos;re looking to start a business or enhance your existing skillset, this course provides step-by-step guidance from industry professionals.
                                    </p>
                                )}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <h2 className="text-2xl font-bold text-foreground mb-4">What You'll Learn</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {whatYouWillLearn.map((item, i) => (
                                        <motion.div
                                            key={item}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            className="flex items-start gap-2"
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                                            <span className="text-foreground text-sm">{item}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {course.whoIsCourseFor && (
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Who This Course Is For</h2>
                                    <div
                                        className="prose-custom text-muted-foreground leading-relaxed max-w-none"
                                        dangerouslySetInnerHTML={{ __html: course.whoIsCourseFor }}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Sticky sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="sticky top-20 bg-card rounded-2xl border border-border shadow-card p-6 space-y-5"
                            >
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    {!isFree && (
                                        <span className="text-muted-foreground line-through text-lg">{formatPrice(course.originalFee)}</span>
                                    )}
                                    <span className="text-3xl font-bold text-primary">
                                        {isFree ? "Free" : formatPrice(course.discountedFee)}
                                    </span>
                                    {discountPercent > 0 && !isFree && (
                                        <Badge className="bg-primary text-primary-foreground border-0">{discountPercent}% off</Badge>
                                    )}
                                </div>

                                <div ref={enrollBtnRef}>
                                    <LoadingButton
                                        variant="hero"
                                        size="lg"
                                        className="w-full h-12 text-base"
                                        loading={isAddingToCart}
                                        onClick={handleEnroll}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        {inCart ? "Go to Cart" : isFree ? "Enroll for Free" : "Get Instant Access"}
                                    </LoadingButton>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-border">
                                    {sidebarFeatures.map((item) => (
                                        <div key={item.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <item.icon className="h-4 w-4 text-primary" />
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-12 lg:col-span-2">
                        <CourseReviews courseId={course.id} averageRating={rating.average} reviewCount={rating.count} />
                    </div>
                </div>
            </section>

            {/* Floating bottom bar */}
            <AnimatePresence>
                {!sidebarVisible && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3"
                    >
                        <div className="container flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {discountPercent > 0 && !isFree && (
                                    <Badge className="bg-primary/10 text-primary border-0 text-xs whitespace-nowrap shrink-0">{discountPercent}% off</Badge>
                                )}
                                <span className="text-xl font-bold text-primary truncate">
                                    {isFree ? "Free" : formatPrice(course.discountedFee)}
                                </span>
                            </div>
                            <div className="shrink-0">
                                <LoadingButton
                                    variant="hero"
                                    size="lg"
                                    className="h-11"
                                    loading={isAddingToCart}
                                    onClick={handleEnroll}
                                >
                                    <Zap className="h-4 w-4" />
                                    {inCart ? "Go to Cart" : isFree ? "Enroll Free" : "Get Instant Access"}
                                </LoadingButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!sidebarVisible && <div className="h-16" />}
        </div>
    );
};

export default CourseDetail;
