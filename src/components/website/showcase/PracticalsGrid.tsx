'use client';

import { useState } from "react";
import { ImageIcon, Play } from "lucide-react";
import type { PublicPractical } from "@/src/lib/public-showcase";
import { imageThumb, videoPoster } from "@/src/utils/media";
import { coursesUrl } from "@/src/utils/url";
import MediaLightbox, { LightboxItem } from "./MediaLightbox";

interface PracticalsGridProps {
    practicals: PublicPractical[];
    /** Show the course name on each tile (off on a course's own page). */
    showCourse?: boolean;
}

// Mobile-first media grid: 2 columns on phones, 3 on tablets, 4 on desktop.
const PracticalsGrid = ({ practicals, showCourse = true }: PracticalsGridProps) => {
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    const items: LightboxItem[] = practicals.map((p) => ({
        id: p.id,
        type: p.type,
        url: p.url,
        caption: `Practical by ${p.studentName}`,
        courseTitle: p.course.title,
        courseHref: `${coursesUrl}/${p.course.slug}`,
    }));

    return (
        <>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {practicals.map((p, i) => (
                    <li key={p.id}>
                        <PracticalTile practical={p} showCourse={showCourse} onOpen={() => setViewerIndex(i)} />
                    </li>
                ))}
            </ul>
            <MediaLightbox items={items} index={viewerIndex} onClose={() => setViewerIndex(null)} />
        </>
    );
};

const PracticalTile = ({ practical, showCourse, onOpen }: { practical: PublicPractical; showCourse: boolean; onOpen: () => void }) => {
    const [failed, setFailed] = useState(false);
    const isVideo = practical.type === "video";
    const src = isVideo ? videoPoster(practical.url) : imageThumb(practical.url);

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`${isVideo ? "Play video" : "View photo"} by ${practical.studentName}${showCourse ? `, ${practical.course.title}` : ""}`}
        >
            {src && !failed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    {isVideo ? null : <ImageIcon className="h-8 w-8 text-primary/50" />}
                </div>
            )}

            {isVideo && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 h-5 w-5 fill-white" />
                    </span>
                </span>
            )}

            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-2 pb-1.5 pt-6 text-left">
                <span className="block truncate text-[11px] font-medium text-white sm:text-xs">{practical.studentName}</span>
                {showCourse && <span className="block truncate text-[10px] text-white/80 sm:text-[11px]">{practical.course.title}</span>}
            </span>
        </button>
    );
};

export default PracticalsGrid;
