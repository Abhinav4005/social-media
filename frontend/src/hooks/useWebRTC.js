import { useState, useEffect, useRef, useCallback } from "react";
import Peer from "simple-peer-light";
import { socket } from "../socket";

export function useWebRTC({ streamRef, myVideo, targetUserId, preloadedCall }) {
    const userVideo = useRef(null);
    const connectionRef = useRef(null);
    const durationRef = useRef(null);

    const [incomingCall, setIncomingCall] = useState(preloadedCall || null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [calling, setCalling] = useState(false);
    const [speakerOn, setSpeakerOn] = useState(true);
    const [duration, setDuration] = useState(0);

    const fmt = useCallback((s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`, []);

    useEffect(() => {
        if (preloadedCall && !incomingCall) {
            setIncomingCall(preloadedCall);
        }
    }, [preloadedCall, incomingCall]);

    const endCall = useCallback((emit = true) => {
        if (emit && targetUserId) {
            socket.emit("end-call", { targetUserId });
        }
        connectionRef.current?.destroy();
        connectionRef.current = null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (myVideo.current) myVideo.current.srcObject = null;
        if (userVideo.current) userVideo.current.srcObject = null;
        clearInterval(durationRef.current);
        setCallEnded(true);
        setCallAccepted(false);
        setIncomingCall(null);
        setCalling(false);
    }, [targetUserId, streamRef, myVideo]);

    useEffect(() => {
        const handleIncoming = ({ from, offer }) => setIncomingCall({ from, offer });
        const handleAccepted = ({ answer }) => connectionRef.current?.signal(answer);
        const handleEnded = () => endCall(false);

        socket.on("incoming-call", handleIncoming);
        socket.on("call-accepted", handleAccepted);
        socket.on("call-ended", handleEnded);

        return () => {
            socket.off("incoming-call", handleIncoming);
            socket.off("call-accepted", handleAccepted);
            socket.off("call-ended", handleEnded);
            connectionRef.current?.destroy();
            connectionRef.current = null;
        };
    }, [endCall]);

    useEffect(() => {
        if (callAccepted && !callEnded) {
            setDuration(0);
            durationRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
        }
        return () => clearInterval(durationRef.current);
    }, [callAccepted, callEnded]);

    useEffect(() => {
        if (userVideo.current) {
            userVideo.current.muted = !speakerOn;
        }
    }, [speakerOn]);

    const callUser = useCallback((tid) => {
        if (!streamRef.current || connectionRef.current) return;
        setCalling(true);
        const peer = new Peer({ initiator: true, trickle: false, stream: streamRef.current });
        peer.on("signal", (offer) => socket.emit("call-user", { targetUserId: tid, offer }));
        peer.on("stream", (remote) => {
            if (userVideo.current) userVideo.current.srcObject = remote;
            setCallAccepted(true);
            setCalling(false);
        });
        peer.on("error", (e) => {
            console.error(e);
            setCalling(false);
        });
        connectionRef.current = peer;
    }, [streamRef]);

    const answerCall = useCallback(() => {
        if (!incomingCall) return;
        const { from, offer } = incomingCall;
        const peer = new Peer({ initiator: false, trickle: false, stream: streamRef.current });
        peer.on("signal", (answer) => {
            socket.emit("accept-call", { targetUserId: from, answer });
            setCallAccepted(true);
            setIncomingCall(null);
        });
        peer.on("stream", (remote) => {
            if (userVideo.current) userVideo.current.srcObject = remote;
        });
        peer.signal(offer);
        connectionRef.current = peer;
    }, [incomingCall, streamRef]);

    const toggleSpeaker = useCallback(() => setSpeakerOn((s) => !s), []);

    return {
        userVideo,
        incomingCall,
        callAccepted,
        callEnded,
        calling,
        speakerOn,
        duration,
        fmtDuration: fmt(duration),
        callUser,
        answerCall,
        endCall,
        toggleSpeaker,
    };
}
