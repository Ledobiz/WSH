'use client'

import { Prisma } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/src/components/ui/badge";

import CourseCard from "@/src/components/website/CourseCard";
import CourseCardSkeleton from "@/src/components/website/CourseCardSkeleton";
import { allCoursesForWebsite } from "@/src/services/website/course";
import { fetchAllCategories } from "@/src/services/admin/category";
import ReviewCarousel from "@/src/components/website/ReviewCarousel";
import EmptyState from "@/src/components/website/EmptyState";

type DBCourseInterface = Prisma.CourseGetPayload<{
    include: {
        category: true,
        courseModules: {
            include: {
                moduleComponents: true;
            };
        };
    }
}>;

const getTotalLectures = (course: DBCourseInterface): number => {
    if (!course.courseModules) return 0;
    return course.courseModules.reduce((total, module) => {
        return total + (module.moduleComponents?.length || 0);
    }, 0);
};

const COURSES_PER_PAGE = 20;

const Courses = () => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    const categorySlug = searchParams?.get("category") ?? null;
    const initialSearch = searchParams?.get("search") ?? "";

    const [search, setSearch] = useState(initialSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
    const [categories, setCategories] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [courses, setCourses] = useState<DBCourseInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const pageSize = COURSES_PER_PAGE;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const searchParamsString = searchParams?.toString() ?? "";

    useEffect(() => {
        const urlSearch = searchParams?.get("search") ?? "";
        setSearch(urlSearch);
        setDebouncedSearch(urlSearch);
    }, [searchParamsString, searchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            const dbCategories = await fetchAllCategories();
            setCategories(dbCategories?.categories ?? []);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        if (debouncedSearch) {
            params.set("search", debouncedSearch);
        } else {
            params.delete("search");
        }

        const nextParamsString = params.toString();
        if (nextParamsString === searchParamsString) return;

        const safePathName = pathName || "/courses";
        const nextUrl = nextParamsString ? `${safePathName}?${nextParamsString}` : safePathName;
        replace(nextUrl);
    }, [debouncedSearch, pathName, replace, searchParamsString, searchParams]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const result = await allCoursesForWebsite(1, {
                    pageSize,
                    search: debouncedSearch,
                    categorySlug: categorySlug ?? undefined,
                });

                if (result.success) {
                    setCourses((result.data as DBCourseInterface[]) ?? []);
                    const totalPages = result.pagination?.totalPages ?? 1;
                    setCurrentPage(1);
                    setHasMorePages(1 < totalPages);
                } else {
                    setCourses([]);
                    setCurrentPage(1);
                    setHasMorePages(false);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [debouncedSearch, categorySlug, pageSize]);

    const selectedCategory = categorySlug
        ? categories.find((c) => c.slug === categorySlug)?.name ?? null
        : null;

    const setSelectedCategory = (name: string | null) => {
        const params = new URLSearchParams(searchParams ?? "");
        
        if (name) {
            const cat = categories.find((c) => c.name === name);
            if (cat) params.set('category', cat.slug);
        } else {
            params.delete('category');
        }

        replace(`${pathName}?${params.toString()}`);
    };

    const loadMore = useCallback(async () => {
        if (loading || loadingMore || !hasMorePages) return;

        const nextPage = currentPage + 1;
        setLoadingMore(true);

        try {
            const result = await allCoursesForWebsite(nextPage, {
                pageSize,
                search: debouncedSearch,
                categorySlug: categorySlug ?? undefined,
            });

            if (!result.success) {
                setHasMorePages(false);
                return;
            }

            const newCourses = (result.data as DBCourseInterface[]) ?? [];
            const totalPages = result.pagination?.totalPages ?? currentPage;

            setCourses((prev) => {
                const existingSlugs = new Set(prev.map((course) => course.slug));
                const uniqueNewCourses = newCourses.filter((course) => !existingSlugs.has(course.slug));
                return [...prev, ...uniqueNewCourses];
            });
            setCurrentPage(nextPage);
            setHasMorePages(nextPage < totalPages && newCourses.length > 0);
        } finally {
            setLoadingMore(false);
        }
    }, [loading, loadingMore, hasMorePages, currentPage, pageSize, debouncedSearch, categorySlug]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (loading) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore, loading]);

    return (
        <>
            <section className="bg-primary py-12 md:py-16">
                <div className="container text-primary-foreground">
                    <p className="text-sm opacity-70 mb-2">Home / Courses</p>
                    <h1 className="text-3xl md:text-5xl font-bold">Courses</h1>
                    <p className="text-lg opacity-80 mt-2">We found <span className="font-bold">{courses.length}</span> course(s) for you</p>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="container">
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                className={`cursor-pointer transition-all duration-200 px-4 py-2 text-sm hover:scale-105 active:scale-95 ${
                                    !selectedCategory
                                    ? "bg-primary text-primary-foreground border-0"
                                    : "bg-card text-muted-foreground border border-border hover:border-primary/30"
                                }`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                All
                            </Badge>
                            {categories.map((cat) => (
                                <Badge
                                    key={cat.slug}
                                    className={`cursor-pointer transition-all duration-200 px-4 py-2 text-sm hover:scale-105 active:scale-95 ${
                                    selectedCategory === cat.name
                                        ? "bg-primary text-primary-foreground border-0"
                                        : "bg-card text-muted-foreground border border-border hover:border-primary/30"
                                    }`}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    {cat.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <CourseCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : courses.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {courses.map((course, i) => (
                                    <CourseCard 
                                        key={course.slug} 
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

                            {/* Infinite scroll sentinel */}
                            {hasMorePages && (
                                <div ref={sentinelRef} className="flex justify-center py-10">
                                    {loadingMore && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2 text-muted-foreground"
                                        >
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            <span className="text-sm">Loading more courses...</span>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {!hasMorePages && courses.length > COURSES_PER_PAGE && (
                                <p className="text-center text-muted-foreground text-sm py-8">You've seen all available courses</p>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            icon={SearchX}
                            title="No courses found"
                            description="Try adjusting your search or filter to find what you're looking for."
                            actionLabel="View All Courses"
                            actionLink="/courses"
                        />
                    )}
                </div>
            </section>

            <ReviewCarousel />
        </>
    )
}
export default Courses