'use client';

import { useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import PracticalsGrid from "./PracticalsGrid";
import { getPublicPracticals } from "@/src/services/website/showcase";
import type { PublicPractical } from "@/src/lib/public-showcase";

const PAGE_SIZE = 6;

// "Student Practicals" on a course page: work submitted by certified students.
const CoursePracticals = ({ courseSlug }: { courseSlug: string }) => {
    const [items, setItems] = useState<PublicPractical[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        getPublicPracticals({ courseSlug, page: 1, pageSize: PAGE_SIZE })
            .then((result) => {
                if (!active) return;
                setItems(result.practicals);
                setTotal(result.total);
                setHasMore(result.hasMore);
                setPage(1);
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [courseSlug]);

    const showMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const next = page + 1;
            const result = await getPublicPracticals({ courseSlug, page: next, pageSize: PAGE_SIZE });
            setItems((prev) => {
                const seen = new Set(prev.map((p) => p.id));
                return [...prev, ...result.practicals.filter((p) => !seen.has(p.id))];
            });
            setHasMore(result.hasMore);
            setPage(next);
        } finally {
            setLoadingMore(false);
        }
    };

    if (!loading && items.length === 0) return null;

    return (
        <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} aria-labelledby="course-practicals-heading">
            <div className="mb-4">
                <h2 id="course-practicals-heading" className="flex items-center gap-2 text-xl font-bold text-foreground sm:text-2xl">
                    <Camera className="h-5 w-5 text-primary" /> Student Practicals
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Real work from certified students of this course{total > 0 ? ` (${total})` : ""}. Tap to view.
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-xl" />)}
                </div>
            ) : (
                <PracticalsGrid practicals={items} showCourse={false} />
            )}

            {hasMore && (
                <Button variant="outline" onClick={showMore} disabled={loadingMore} className="mt-4 w-full sm:w-auto">
                    {loadingMore ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</> : `Show more practicals (${total - items.length})`}
                </Button>
            )}
        </motion.section>
    );
};

export default CoursePracticals;
