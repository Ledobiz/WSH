'use client';

import { useState } from "react";
import Link from "next/link";
import { MessageCircleReply, Quote, Star } from "lucide-react";
import type { PublicReview } from "@/src/lib/public-showcase";
import { imageThumb, initials } from "@/src/utils/media";
import { coursesUrl } from "@/src/utils/url";
import MediaLightbox, { LightboxItem } from "./MediaLightbox";

const CLAMP_AT = 220; // characters before "Read more" appears
const MAX_THUMBS = 3;

interface ReviewCardProps {
    review: PublicReview;
    /** Show the course name (off on a course's own page). */
    showCourse?: boolean;
    /** Compact styling for carousels: fixed height, quote icon. */
    variant?: "default" | "carousel";
}

export const Stars = ({ rating, className = "h-3.5 w-3.5" }: { rating: number; className?: string }) => (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`${className} ${i < rating ? "fill-accent text-accent" : "text-border"}`} />
        ))}
    </div>
);

const ReviewCard = ({ review, showCourse = true, variant = "default" }: ReviewCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    const long = review.comment.length > CLAMP_AT;
    const isCarousel = variant === "carousel";
    const extra = review.images.length - MAX_THUMBS;

    const lightboxItems: LightboxItem[] = review.images.map((url, i) => ({
        id: `${review.id}-${i}`,
        type: "image",
        url,
        caption: review.author.name,
        courseTitle: review.course?.title,
        courseHref: review.course ? `${coursesUrl}/${review.course.slug}` : undefined,
    }));

    return (
        <article className={`flex h-full flex-col rounded-2xl border border-border bg-card p-5 ${isCarousel ? "shadow-sm" : ""}`}>
            {isCarousel && <Quote className="mb-3 h-6 w-6 text-primary/20" aria-hidden />}

            <div className="flex items-start gap-3">
                {review.author.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageThumb(review.author.image, 96)} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" loading="lazy" />
                ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden>
                        {review.author.anonymous ? "?" : initials(review.author.name)}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{review.author.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Stars rating={review.rating} />
                        <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex-1">
                <p className={`whitespace-pre-line text-sm leading-relaxed text-muted-foreground ${!expanded && long ? "line-clamp-4" : ""}`}>
                    {review.comment}
                </p>
                {long && (
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="mt-1 py-1 text-xs font-medium text-primary hover:underline"
                        aria-expanded={expanded}
                    >
                        {expanded ? "Show less" : "Read more"}
                    </button>
                )}
            </div>

            {review.images.length > 0 && (
                <div className="mt-3 flex gap-2">
                    {review.images.slice(0, MAX_THUMBS).map((url, i) => (
                        <button
                            key={url + i}
                            type="button"
                            onClick={() => setViewerIndex(i)}
                            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-20 sm:w-20"
                            aria-label={`View photo ${i + 1} of ${review.images.length}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageThumb(url, 200)} alt="" className="h-full w-full object-cover" loading="lazy" />
                            {i === MAX_THUMBS - 1 && extra > 0 && (
                                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">+{extra}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {review.reply && !isCarousel && (
                <div className="mt-3 rounded-xl bg-muted/60 p-3">
                    <p className="flex items-center gap-1 text-xs font-semibold text-foreground">
                        <MessageCircleReply className="h-3.5 w-3.5 text-primary" /> Reply from Women Skills Hub
                    </p>
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">{review.reply}</p>
                </div>
            )}

            {showCourse && review.course && (
                <div className="mt-3 border-t border-border pt-3">
                    <Link href={`${coursesUrl}/${review.course.slug}`} className="line-clamp-1 text-xs font-medium text-primary hover:underline">
                        {review.course.title}
                    </Link>
                </div>
            )}

            <MediaLightbox items={lightboxItems} index={viewerIndex} onClose={() => setViewerIndex(null)} />
        </article>
    );
};

export default ReviewCard;
