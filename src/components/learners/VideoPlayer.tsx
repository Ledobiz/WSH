'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Maximize, Minimize } from 'lucide-react';

const VideoPlayer = ({videoId, isStudent = false, showFullscreenToggle = false}: {videoId: string, isStudent?: boolean, showFullscreenToggle?: boolean}) => {
    const [src, setSrc] = useState('');
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
    const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function startRefresh() {
        if (refreshIntervalRef.current) return;

        refreshIntervalRef.current = setInterval(() => {
            fetchVideoToken();
        }, 4 * 60 * 1000); // every 4 minutes
    }

    function stopRefresh() {
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
    }

    const stableVideoId = useMemo(() => videoId, [videoId]);
    const stableIsStudent = useMemo(() => isStudent, [isStudent]);

    const toggleVideoFullscreen = useCallback(() => {
        if (!videoContainerRef.current) return;
        if (!document.fullscreenElement) {
            videoContainerRef.current.requestFullscreen().then(() => setIsVideoFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsVideoFullscreen(false)).catch(() => {});
        }
    }, []);

    useEffect(() => {
        const handleFsChange = () => setIsVideoFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handleFsChange);
        return () => document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    const fetchVideoToken = useCallback(async (resetSrc = false) => {
        if (resetSrc) setSrc('');
        const res = await fetch('/api/video/token', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                videoId: stableVideoId,
                isStudent: stableIsStudent,
            }),
        });

        if (!res.ok) return;
        const data = await res.json();

        setSrc(data.playbackUrl);
    }, [stableVideoId, stableIsStudent]);

    useEffect(() => {
        // Hard reset on video change to show loader and refresh token
        stopRefresh();
        fetchVideoToken(true);

        return () => stopRefresh();
    }, [videoId, isStudent, fetchVideoToken]);

    return (
        <div
            ref={videoContainerRef}
            className={`relative group rounded-2xl overflow-hidden border border-border ${
                isVideoFullscreen ? "rounded-none border-0" : "aspect-video"
            }`}
            style={isVideoFullscreen ? { width: "100vw", height: "100vh" } : undefined}
        >
            {!src ? (
                <div className="w-full h-full bg-primary flex flex-col items-center justify-center text-primary-foreground p-6 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary-foreground/15 flex items-center justify-center mb-4">
                        <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin" />
                    </div>
                    <h3 className="text-base md:text-lg font-display font-bold mb-1">Loading video...</h3>
                    <p className="text-xs md:text-sm text-primary-foreground/70 max-w-xs">
                        Please wait while we fetch your lecture content
                    </p>
                </div>
            ) : (
                <>
                    <div className="w-full h-full bg-primary">
                        <iframe
                            src={src}
                            loading="lazy"
                            onPlay={startRefresh}
                            onPause={stopRefresh}
                            onEnded={stopRefresh}
                            className="lecture-iframe"
                            style={{
                                border: 0,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%'
                            }}
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen
                        />
                    </div>

                    {showFullscreenToggle && (
                        <button
                            onClick={toggleVideoFullscreen}
                            className="absolute bottom-3 right-3 z-10 p-2 rounded-lg bg-foreground/70 text-background hover:bg-foreground/90 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 md:bottom-4 md:right-4"
                            aria-label={isVideoFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        >
                            {isVideoFullscreen ? (
                                <Minimize className="h-4 w-4 md:h-5 md:w-5" />
                            ) : (
                                <Maximize className="h-4 w-4 md:h-5 md:w-5" />
                            )}
                        </button>
                    )}
                </>
            )}
        </div>
    )
}
export default VideoPlayer