'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ButtonLoader from '../admin/ButtonLoader';

const VideoPlayer = ({videoId, isStudent = false}: {videoId: string, isStudent?: boolean}) => {
    const [src, setSrc] = useState('');
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
        <div className="video-box d-flex align-items-center justify-content-center">
            {!src ? (
                <div className="text-center text-white">
                    <div className="fs-1 mb-3">🎥</div>
                    <p className="fs-4 fw-semibold mb-1">Loading video...</p>
                    <p className="small text-light opacity-75">Please wait</p>
                    <ButtonLoader />
                </div>
            ) : (
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
                ></iframe>
                /*<ReactPlayer 
                    src={src}
                    controls
                    onPlay={startRefresh}
                    onPause={stopRefresh}
                    onEnded={stopRefresh}
                    height='100%'
                    width='100%'
                />*/
            )}
        </div>
    )
}
export default VideoPlayer