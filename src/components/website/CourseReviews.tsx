'use client';

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import ReviewCard, { Stars } from "@/src/components/website/showcase/ReviewCard";
import { courseReviews } from "@/src/services/website/course";
import type { PublicReview } from "@/src/lib/public-showcase";
import { reviewsUrl } from "@/src/utils/url";

interface CourseReviewsProps {
    courseId: string;
    courseSlug?: string;
    averageRating?: number;
    reviewCount?: number;
}

const PAGE = 3; // keep the course page short on phones; "Show more" adds 2 pages

const CourseReviews = ({ courseId, courseSlug, averageRating = 0, reviewCount = 0 }: CourseReviewsProps) => {
    const [reviews, setReviews] = useState<PublicReview[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(reviewCount);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchPages = useCallback(async (from: number, count: number) => {
        const results = await Promise.all(
            Array.from({ length: count }, (_, i) => courseReviews(courseId, from + i, PAGE)),
        );
        setTotal(results[0]?.pagination?.totalCount ?? 0);
        return results.flatMap((r) => (r.data ?? []) as PublicReview[]);
    }, [courseId]);

    useEffect(() => {
        let active = true;
        setLoading(true);
        fetchPages(1, 1)
            .then((rows) => { if (active) { setReviews(rows); setPage(1); } })
            .catch((error) => console.log("Error loading reviews:", error))
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [fetchPages]);

    const showMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const rows = await fetchPages(page + 1, 2);
            setReviews((prev) => {
                const seen = new Set(prev.map((r) => r.id));
                return [...prev, ...rows.filter((r) => !seen.has(r.id))];
            });
            setPage((p) => p + 2);
        } catch (error) {
            console.log("Error loading more reviews:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    if (!loading && reviews.length === 0) return null;

    const avg = averageRating > 0 ? averageRating : 0;
    const remaining = Math.max(0, total - reviews.length);

    return (
        <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} aria-labelledby="course-reviews-heading">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h2 id="course-reviews-heading" className="text-xl font-bold text-foreground sm:text-2xl">Student Reviews</h2>
                {total > 0 && (
                    <div className="flex items-center gap-3 self-start rounded-xl bg-accent/10 px-3 py-2 sm:self-auto">
                        <span className="text-2xl font-bold leading-none text-foreground">{avg.toFixed(1)}</span>
                        <div>
                            <Stars rating={Math.round(avg)} className="h-4 w-4" />
                            <p className="mt-0.5 text-xs text-muted-foreground">{total} {total === 1 ? "review" : "reviews"}</p>
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[0, 1].map((i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.map((review) => <ReviewCard key={review.id} review={review} showCourse={false} />)}
                </div>
            )}

            {!loading && (remaining > 0 || courseSlug) && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {remaining > 0 && (
                        <Button variant="outline" onClick={showMore} disabled={loadingMore} className="w-full sm:w-auto">
                            {loadingMore ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</> : `Show more reviews (${remaining})`}
                        </Button>
                    )}
                    {courseSlug && (
                        <Button asChild variant="ghost" className="w-full text-primary sm:w-auto">
                            <Link href={`${reviewsUrl}?course=${encodeURIComponent(courseSlug)}`}>See all reviews &amp; practicals</Link>
                        </Button>
                    )}
                </div>
            )}
        </motion.section>
    );
};

export default CourseReviews;
