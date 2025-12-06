'use client'

import ReactPlayer from 'react-player'

const VideoPlayer = () => {
    return (
        <div className="video-box d-flex align-items-center justify-content-center">
            <ReactPlayer 
                src='https://www.youtube.com/watch?v=LXb3EKWsInQ' 
                height='100%'
                width='100%'
            />

            {/* <div className="text-center text-white">
                <div className="fs-1 mb-3">🎥</div>
                <p className="fs-4 fw-semibold mb-1">No video available</p>
                <p className="small text-light opacity-75">Invalid Video URL</p>
            </div> */}
        </div>
    )
}
export default VideoPlayer