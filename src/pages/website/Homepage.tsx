'use client'

import { motion } from "framer-motion";
import { Search, BookOpen, Award, ArrowRight, CheckCircle2, Sparkles, Monitor, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categories as staticCat } from "@/src/data/courses";
import { Prisma } from "@prisma/client";

import { Skeleton } from "@/src/components/ui/skeleton";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { coursesUrl, registerUrl } from "@/src/utils/url";
import CourseCardSkeleton from "@/src/components/website/CourseCardSkeleton";
import CourseCard from "@/src/components/website/CourseCard";
import { getTotalLectures } from "@/src/utils/client_functions";
import ReviewCarousel from "@/src/components/website/ReviewCarousel";
import { categoryCourses, homepageCourses } from "@/src/services/website/course";

type CategoryInterface = Prisma.CategoryGetPayload<{
    include: {
        courses: {
            include: {
                courseModules: {
                    where: { deletedAt: null },
                    include: {
                        moduleComponents: true;
                    }
                }
            }
        }
    }
}>;

const CategorySkeleton = () => (
    <div className="p-6 rounded-2xl border border-border bg-card text-center">
        <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3" />
        <Skeleton className="h-5 w-3/4 mx-auto mb-1" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
);

const Homepage = () => {
    const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchContent = async () => {
            const dbcategories = await categoryCourses();
            setCategories(dbcategories.categories);
            setLoadingCategories(false);

            const dbCourses = await homepageCourses();
            setCourses(dbCourses.courses);
            setLoadingCourses(false);
        }

        fetchContent();
    }, []);


    return (
        <>
            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">How It Works</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Start Learning In 3 Simple Steps
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            High-impact, career-focused courses designed for women — from digital skills to business and professional development.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-start relative">
                        <div className="hidden md:block absolute top-[36px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] border-t-2 border-dashed border-border z-0" />

                        {[
                            { icon: Search, title: "Explore Skill-Based Courses", desc: "Browse beginner to advanced classes in baking, mocktails, paper crafts and more.", color: "bg-primary/10 text-primary" },
                            { icon: BookOpen, title: "Enroll & Learn At Your Pace", desc: "Start right away — online with flexible schedules and lifetime access.", color: "bg-accent/10 text-accent" },
                            { icon: Award, title: "Earn A Certification", desc: "Receive certificates to showcase your learning and boost your career.", color: "bg-success/10 text-success" },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                viewport={{ once: true }}
                                className="text-center px-6 relative z-10"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-5`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-secondary">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
                    >
                        <div>
                            <Badge variant="secondary" className="mb-4 text-primary font-medium bg-primary/10">Our Courses</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Explore Our Courses</h2>
                            <p className="text-muted-foreground mt-2">Learn from industry experts and advance your career</p>
                        </div>

                        <Link href={coursesUrl}>
                            <Button variant="outline-hero" className="shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                                View All Courses <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    {loadingCourses ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <CourseCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map((course, i) => (
                                <CourseCard key={course.slug} 
                                    course={course} 
                                    slug={course.slug}
                                    title={course.title}
                                    lectures={getTotalLectures(course)}
                                    originalPrice={course.originalFee}
                                    discountedPrice={course.discountedFee}
                                    image={course.thumbnail ?? ''}
                                    isFree={course.isFree} 
                                    index={i} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">Categories</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Discover What You Love</h2>
                        <p className="text-muted-foreground text-lg">Browse a wide range of subjects to start learning what you love.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {loadingCategories
                            ? Array.from({ length: 5 }).map((_, i) => <CategorySkeleton key={i} />)
                            : categories?.map((cat, i) => {
                                const currentCat = staticCat.find((c) => c.slug === cat.slug);

                                return (
                                    <motion.div
                                        key={cat.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -4 }}
                                    >
                                        <Link
                                            href={`${coursesUrl}?category=${cat.slug}`}
                                            className="block p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-card-hover transition-all text-center group"
                                        >
                                            <span className="text-4xl block mb-3" role="img">{currentCat?.icon || "🥧"}</span>
                                            <h3 className="font-display font-semibold text-foreground mb-1">{cat.name}</h3>
                                            <p className="text-sm text-muted-foreground">{cat.courses.length} {cat.courses.length === 1 ? "Course" : "Courses"}</p>
                                        </Link>
                                    </motion.div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>

            {/* Benefits / Why Choose Us */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">Why Choose Us</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Benefits Of Women Skills Hub
                            </h2>
                            <p className="text-muted-foreground text-lg mb-10">
                                We're empowering women with practical, income-generating skills. Whether you're starting a business, switching careers, or earning more income.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { icon: Monitor, title: "100% Online, Flexible Learning", desc: "Lifetime access to courses and materials. Learn at your own pace, on any device." },
                                    { icon: Sparkles, title: "Hands-on, Practical Lessons", desc: "Skills you can apply immediately — real-world applicable techniques and recipes." },
                                    { icon: CheckCircle2, title: "Courses Delivered As Advertised", desc: "No hidden fees or surprise charges. What you see is what you get." },
                                    { icon: Clock, title: "Lifetime Access", desc: "Once enrolled, access your course materials forever. Learn and revisit anytime." },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <item.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <div className="bg-primary/5 rounded-3xl w-full max-w-lg aspect-square flex flex-col items-center justify-center gap-4">
                                <span className="text-6xl">🎓</span>
                                <p className="text-2xl md:text-3xl font-bold text-foreground">Learn. Earn. Grow.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <ReviewCarousel />

            {/* CTA */}
            <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="container relative text-center text-primary-foreground">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready To Start Your Journey?
                        </h2>
                        <p className="text-lg opacity-90">
                            Join thousands of women already learning practical skills and building profitable businesses.
                        </p>
                        <Link href={registerUrl}>
                            <Button variant="accent" size="lg" className="h-12 hover:scale-105 active:scale-95 transition-transform text-center cursor-pointer">
                                Get Started Today
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
export default Homepage