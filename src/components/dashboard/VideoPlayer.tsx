'use client'

import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import ButtonLoader from '../admin/ButtonLoader';

const VideoPlayer = ({videoId}: {videoId: string}) => {
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

    async function fetchVideoToken() {
        const res = await fetch('/api/video/token', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({videoId}),
        });

        if (!res.ok) return;
        const data = await res.json();

        setSrc(data.playbackUrl);
    }

    useEffect(() => {
        fetchVideoToken();
        stopRefresh(); // reset on video change

        return () => stopRefresh();
    }, [videoId]);

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
                    style={{
                        border: 0,
                        position: 'absolute',
                        top: 0,
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