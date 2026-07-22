'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect, useCallback } from "react";
import { Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { courseReviews } from "@/src/services/website/course";

interface CourseReviewsProps {
  courseId: string;
  averageRating?: number;
  reviewCount?: number;
}

const REVIEWS_PER_PAGE = 6;

const getInitials = (name?: string | null) => {
  if (!name) return "A";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "A";
};

const CourseReviews = ({ courseId, averageRating = 0, reviewCount = 0 }: CourseReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(reviewCount);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = reviews.length < totalCount;

  const fetchPage = useCallback(async (pageToLoad: number) => {
    const result = await courseReviews(courseId, pageToLoad, REVIEWS_PER_PAGE);
    const rows = (result as any).data || [];
    setTotalCount((result as any).pagination?.totalCount ?? rows.length);
    setReviews((prev) => (pageToLoad === 1 ? rows : [...prev, ...rows]));
  }, [courseId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPage(1)
      .catch((error) => console.log("Error loading reviews:", error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    try {
      await fetchPage(next);
      setPage(next);
    } catch (error) {
      console.log("Error loading more reviews:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, hasMore, page, fetchPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Nothing to show and nothing loading — hide the section entirely.
  if (!loading && totalCount === 0 && reviews.length === 0) return null;

  const avg = averageRating > 0 ? averageRating.toFixed(1) : "0.0";

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Student Reviews</h2>
        {totalCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(avg)) ? "fill-accent text-accent" : "text-border"}`} />
              ))}
            </div>
            <span className="font-semibold text-foreground">{avg}</span>
            <span className="text-muted-foreground text-sm">({totalCount} {totalCount === 1 ? "review" : "reviews"})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const name = review.isAnonymous ? "Anonymous" : (review.user?.name || "Student");
            return (
              <div key={review.id} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {!review.isAnonymous && review.user?.image ? (
                      <img src={review.user.image} alt={name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {getInitials(name)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-accent text-accent" : "text-border"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                {review.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.images.map((img: string, i: number) => (
                      <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>
      )}
    </motion.div>
  );
};

export default CourseReviews;
