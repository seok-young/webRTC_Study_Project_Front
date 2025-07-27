import { useEffect } from 'react'

export function useVideoStream(videoRef, stream) {
    useEffect(() => {
        if(stream) {
            if(videoRef.current) {
                const streamId = videoRef.current.dataset.streamId;
                // 중복 방지
                if(streamId !== stream.id) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.dataset.streamId = stream.id;
                }
            }
        } else {
            if(videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.dataset.streamId = null;
            }
        }

        return () => {
            // 클린 업(컴포넌트 언마운트 혹은 [videoRef, stream] 바뀌면)
            if(videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.dataset.streamId = null;
            }
        }
    }, [videoRef, stream]);
}