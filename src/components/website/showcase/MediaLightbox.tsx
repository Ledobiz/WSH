'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { imageLarge, videoPoster } from "@/src/utils/media";

export interface LightboxItem {
    id: string;
    type: "image" | "video";
    url: string;
    caption?: string;
    courseTitle?: string;
    courseHref?: string;
}

interface MediaLightboxProps {
    items: LightboxItem[];
    /** Index to open at; null closes the viewer. */
    index: number | null;
    onClose: () => void;
}

// Full-screen, swipeable viewer for photos and videos. Videos only download when
// their slide is shown, and pause when the user swipes away.
const MediaLightbox = ({ items, index, onClose }: MediaLightboxProps) => {
    const open = index !== null && items.length > 0;
    return (
        <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/95 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    className="fixed inset-0 z-[60] flex flex-col text-white outline-none"
                    aria-describedby={undefined}
                >
                    <DialogPrimitive.Title className="sr-only">Media viewer</DialogPrimitive.Title>
                    {open && <LightboxBody items={items} startIndex={index!} />}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

const LightboxBody = ({ items, startIndex }: { items: LightboxItem[]; startIndex: number }) => {
    const [emblaRef, embla] = useEmblaCarousel({ startIndex, loop: false });
    const [current, setCurrent] = useState(startIndex);
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

    useEffect(() => {
        if (!embla) return;
        const onSelect = () => {
            const i = embla.selectedScrollSnap();
            setCurrent(i);
            // Pause any video that is no longer on screen.
            Object.entries(videoRefs.current).forEach(([id, video]) => {
                if (video && id !== items[i]?.id && !video.paused) video.pause();
            });
        };
        embla.on("select", onSelect);
        return () => { embla.off("select", onSelect); };
    }, [embla, items]);

    const prev = useCallback(() => embla?.scrollPrev(), [embla]);
    const next = useCallback(() => embla?.scrollNext(), [embla]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [prev, next]);

    const item = items[current];

    return (
        <>
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <span className="text-sm tabular-nums text-white/80">{current + 1} / {items.length}</span>
                <DialogPrimitive.Close
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </DialogPrimitive.Close>
            </div>

            {/* Slides */}
            <div className="relative min-h-0 flex-1">
                <div ref={emblaRef} className="h-full overflow-hidden">
                    <div className="flex h-full touch-pan-y">
                        {items.map((media, i) => (
                            <div key={media.id} className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center px-2 sm:px-16">
                                {media.type === "video" ? (
                                    <video
                                        ref={(el) => { videoRefs.current[media.id] = el; }}
                                        src={Math.abs(i - current) <= 1 ? media.url : undefined}
                                        poster={videoPoster(media.url, 960)}
                                        controls
                                        playsInline
                                        preload={i === current ? "metadata" : "none"}
                                        className="max-h-full max-w-full rounded-lg bg-black"
                                    />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={Math.abs(i - current) <= 1 ? imageLarge(media.url) : undefined}
                                        alt={media.caption ? `Photo by ${media.caption}` : "Student photo"}
                                        className="max-h-full max-w-full select-none rounded-lg object-contain"
                                        draggable={false}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {items.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            disabled={current === 0}
                            aria-label="Previous"
                            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30 sm:flex"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={next}
                            disabled={current === items.length - 1}
                            aria-label="Next"
                            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30 sm:flex"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Caption */}
            <div className="min-h-[4.5rem] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
                {item?.caption && <p className="text-sm font-medium">{item.caption}</p>}
                {item?.courseTitle && (
                    item.courseHref ? (
                        <Link href={item.courseHref} className="mt-0.5 inline-block text-xs text-white/70 underline-offset-2 hover:underline">
                            {item.courseTitle}
                        </Link>
                    ) : (
                        <p className="mt-0.5 text-xs text-white/70">{item.courseTitle}</p>
                    )
                )}
                {items.length > 1 && <p className="mt-1 text-[11px] text-white/50 sm:hidden">Swipe to see more</p>}
            </div>
        </>
    );
};

export default MediaLightbox;
