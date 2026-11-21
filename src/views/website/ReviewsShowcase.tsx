'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Loader2, MessageSquare, Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import EmptyState from "@/src/components/website/EmptyState";
import ReviewCard from "@/src/components/website/showcase/ReviewCard";
import PracticalsGrid from "@/src/components/website/showcase/PracticalsGrid";
import { getPublicPracticals, getPublicReviews, getShowcaseSummary } from "@/src/services/website/showcase";
import type { PublicPractical, PublicReview } from "@/src/lib/public-showcase";
import { coursesUrl } from "@/src/utils/url";

type Tab = "reviews" | "practicals";
const PAGE_SIZE = 12;

type Summary = Awaited<ReturnType<typeof getShowcaseSummary>>;

const ReviewsShowcase = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const tab: Tab = params.get("tab") === "practicals" ? "practicals" : "reviews";
    const course = params.get("course") ?? "";

    const [summary, setSummary] = useState<Summary | null>(null);
    const [reviews, setReviews] = useState<PublicReview[]>([]);
    const [practicals, setPracticals] = useState<PublicPractical[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const requestId = useRef(0);

    useEffect(() => { getShowcaseSummary().then(setSummary); }, []);

    const setFilters = (next: { tab?: Tab; course?: string }) => {
        const q = new URLSearchParams(params.toString());
        const nextTab = next.tab ?? tab;
        const nextCourse = next.course ?? course;
        if (nextTab === "practicals") q.set("tab", "practicals"); else q.delete("tab");
        if (nextCourse) q.set("course", nextCourse); else q.delete("course");
        const qs = q.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const load = useCallback(async (pageToLoad: number) => {
        const id = ++requestId.current;
        const options = { courseSlug: course || undefined, page: pageToLoad, pageSize: PAGE_SIZE };
        if (tab === "reviews") {
            const result = await getPublicReviews(options);
            if (id !== requestId.current) return;
            setReviews((prev) => (pageToLoad === 1 ? result.reviews : [...prev, ...result.reviews.filter((r) => !prev.some((p) => p.id === r.id))]));
            setTotal(result.total);
            setHasMore(result.hasMore);
        } else {
            const result = await getPublicPracticals(options);
            if (id !== requestId.current) return;
            setPracticals((prev) => (pageToLoad === 1 ? result.practicals : [...prev, ...result.practicals.filter((r) => !prev.some((p) => p.id === r.id))]));
            setTotal(result.total);
            setHasMore(result.hasMore);
        }
        setPage(pageToLoad);
    }, [tab, course]);

    useEffect(() => {
        setLoading(true);
        load(1).finally(() => setLoading(false));
    }, [load]);

    const showMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try { await load(page + 1); } finally { setLoadingMore(false); }
    };

    const courseTitle = summary?.courses.find((c) => c.slug === course)?.title;
    const items = tab === "reviews" ? reviews : practicals;

    return (
        <>
            {/* Hero */}
            <section className="bg-primary py-10 md:py-16">
                <div className="container text-primary-foreground">
                    <p className="mb-2 text-sm opacity-70">Home / Reviews</p>
                    <h1 className="text-3xl font-bold md:text-5xl">Student Reviews &amp; Practicals</h1>
                    <p className="mt-2 max-w-2xl text-base opacity-85 md:text-lg">
                        Honest reviews and real work from women who learned with Women Skills Hub.
                    </p>

                    <div className="mt-6 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
                        <Stat
                            value={summary ? (summary.averageRating > 0 ? summary.averageRating.toFixed(1) : "–") : null}
                            label="Average rating"
                            icon={<Star className="h-4 w-4 fill-accent text-accent" />}
                        />
                        <Stat value={summary ? String(summary.reviewCount) : null} label={summary?.reviewCount === 1 ? "Review" : "Reviews"} />
                        <Stat value={summary ? String(summary.practicalCount) : null} label={summary?.practicalCount === 1 ? "Practical" : "Practicals"} />
                    </div>
                </div>
            </section>

            {/* Controls: sticky under the navbar so they stay reachable while scrolling */}
            <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur md:top-[4.5rem]">
                <div className="container flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid grid-cols-2 rounded-xl bg-muted p-1 sm:inline-grid sm:w-auto" role="tablist" aria-label="Show">
                        <TabButton active={tab === "reviews"} onClick={() => setFilters({ tab: "reviews" })} icon={<MessageSquare className="h-4 w-4" />}>
                            Reviews{summary ? ` (${summary.reviewCount})` : ""}
                        </TabButton>
                        <TabButton active={tab === "practicals"} onClick={() => setFilters({ tab: "practicals" })} icon={<Camera className="h-4 w-4" />}>
                            Practicals{summary ? ` (${summary.practicalCount})` : ""}
                        </TabButton>
                    </div>

                    {summary && summary.courses.length > 0 && (
                        <label className="flex items-center gap-2 text-sm">
                            <span className="sr-only">Filter by course</span>
                            <select
                                value={course}
                                onChange={(e) => setFilters({ course: e.target.value })}
                                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground sm:w-64"
                            >
                                <option value="">All courses</option>
                                {summary.courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                            </select>
                        </label>
                    )}
                </div>
            </div>

            {/* Content */}
            <section className="py-6 md:py-10">
                <div className="container">
                    {!loading && total > 0 && (
                        <p className="mb-4 text-sm text-muted-foreground">
                            {total} {tab === "reviews" ? (total === 1 ? "review" : "reviews") : (total === 1 ? "practical" : "practicals")}
                            {courseTitle ? <> for <span className="font-medium text-foreground">{courseTitle}</span></> : null}
                        </p>
                    )}

                    {loading ? (
                        tab === "reviews" ? (
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-2xl" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-xl" />)}
                            </div>
                        )
                    ) : items.length === 0 ? (
                        <EmptyState
                            icon={tab === "reviews" ? MessageSquare : Camera}
                            title={tab === "reviews" ? "No reviews yet" : "No practicals yet"}
                            description={
                                tab === "reviews"
                                    ? "Reviews from our students will appear here once they're published."
                                    : "Work from certified students will appear here as certificates are approved."
                            }
                            actionLabel="Browse courses"
                            actionLink={coursesUrl}
                        />
                    ) : tab === "reviews" ? (
                        // Masonry columns keep cards with photos from leaving big gaps.
                        <div className="gap-3 md:columns-2 lg:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
                            {reviews.map((review) => (
                                <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <ReviewCard review={review} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <PracticalsGrid practicals={practicals} />
                    )}

                    {!loading && hasMore && (
                        <div className="mt-6 flex justify-center">
                            <Button variant="outline" onClick={showMore} disabled={loadingMore} className="w-full sm:w-auto">
                                {loadingMore ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</> : `Show more (${total - items.length})`}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-secondary py-12 md:py-16">
                <div className="container text-center">
                    <h2 className="text-2xl font-bold text-foreground md:text-3xl">Ready to start your own story?</h2>
                    <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Learn a practical skill online, at your own pace, and earn your certificate.</p>
                    <Button asChild variant="hero" size="lg" className="mt-6 h-12 w-full sm:w-auto">
                        <Link href={coursesUrl}>Browse courses</Link>
                    </Button>
                </div>
            </section>
        </>
    );
};

const Stat = ({ value, label, icon }: { value: string | null; label: string; icon?: React.ReactNode }) => (
    <div className="rounded-xl bg-primary-foreground/10 px-3 py-3 text-center backdrop-blur-sm">
        {value === null ? (
            <Skeleton className="mx-auto h-7 w-10 bg-primary-foreground/20" />
        ) : (
            <p className="flex items-center justify-center gap-1 text-xl font-bold leading-none md:text-2xl">{icon}{value}</p>
        )}
        <p className="mt-1 text-[11px] opacity-80 sm:text-xs">{label}</p>
    </div>
);

const TabButton = ({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) => (
    <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onClick}
        className={`flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-sm transition-colors ${active ? "bg-background font-semibold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
    >
        {icon}{children}
    </button>
);

export default ReviewsShowcase;
