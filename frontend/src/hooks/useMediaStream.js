import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom Hook: useMediaStream
 * Responsibility: Manages user media device access (camera & mic), tracks, and controls.
 * Fulfills Single Responsibility Principle (SRP) by isolating Media API handling from UI components.
 */
export function useMediaStream() {
    const myVideo = useRef(null);
    const streamRef = useRef(null);

    const [hasCamera, setHasCamera] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    useEffect(() => {
        let mounted = true;
        let localStream = null;
        let retryTimer = null;

        const acquire = (attempt = 1) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    if (!mounted) {
                        stream.getTracks().forEach((t) => t.stop());
                        return;
                    }
                    localStream = stream;
                    streamRef.current = stream;
                    setHasCamera(true);
                    setCameraError(false);
                    if (myVideo.current) myVideo.current.srcObject = stream;
                })
                .catch((err) => {
                    if (!mounted) return;
                    if (err.name === "NotReadableError" && attempt < 3) {
                        retryTimer = setTimeout(() => acquire(attempt + 1), 450);
                        return;
                    }
                    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                        setCameraError(true);
                    }
                });
        };
        acquire();

        return () => {
            mounted = false;
            clearTimeout(retryTimer);
            const s = localStream || streamRef.current;
            s?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    const toggleMic = useCallback(() => {
        if (!streamRef.current) return;
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    }, []);

    const toggleCam = useCallback(() => {
        if (!streamRef.current) return;
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setCamOn(videoTrack.enabled);
        }
    }, []);

    return {
        myVideo,
        streamRef,
        hasCamera,
        cameraError,
        micOn,
        camOn,
        toggleMic,
        toggleCam,
    };
}
