// import React, { useEffect, useRef, useState } from "react";
// import Peer from "simple-peer-light";
// import { socket } from "../../../socket";
// import { useSelector } from "react-redux";
// import { useLocation, useParams } from "react-router-dom";

// const VideoCall = (props) => {

//   const { user } = useSelector((state) => state.auth);
//   const myVideo = useRef(null);
//   const userVideo = useRef(null);
//   const connectionRef = useRef(null);
//   const streamRef = useRef(null); // keep latest stream here
//   const [hasCamera, setHasCamera] = useState(false);

//   const params = useParams();
//   const location = useLocation();

//   const propsRoomId = props.roomId;
//   const propsTargetUserId = props.targetUserId;

//   const roomId = propsRoomId || params.roomId;
//   const targetUserId = propsTargetUserId || location.state?.targetUserId;

//   console.log("VideoCall component mounted with roomId:", roomId, "and targetUserId:", targetUserId);

//   // getUserMedia: run once on mount
//   useEffect(() => {
//     let mounted = true;
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((mediaStream) => {
//         if (!mounted) return;
//         streamRef.current = mediaStream;
//         setHasCamera(true);
//         if (myVideo.current) myVideo.current.srcObject = mediaStream;
//       })
//       .catch((err) => {
//         console.error("getUserMedia error:", err);
//       });

//     return () => {
//       mounted = false;
//       // stop local tracks on unmount
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((t) => t.stop());
//       }
//     };
//   }, []); // empty deps => run once

//   // socket listeners: attach once, clean up on unmount
//   useEffect(() => {
//     const handleIncomingCall = ({ from, offer }) => {
//       // create peer as callee
//       const peer = new Peer({ initiator: false, trickle: false, stream: streamRef.current || undefined });

//       peer.on("signal", (answerData) => {
//         socket.emit("accept-call", { targetUserId: from, answer: answerData });
//       });

//       peer.on("stream", (remoteStream) => {
//         if (userVideo.current) userVideo.current.srcObject = remoteStream;
//       });

//       peer.on("error", (err) => console.error("peer error (callee):", err));
//       peer.on("close", () => {
//         // cleanup when peer closed
//         if (connectionRef.current === peer) connectionRef.current = null;
//         if (userVideo.current) userVideo.current.srcObject = null;
//       });

//       peer.signal(offer);
//       connectionRef.current = peer;
//     };

//     const handleCallAccepted = ({ answer }) => {
//       if (connectionRef.current) {
//         connectionRef.current.signal(answer);
//       } else {
//         console.warn("callAccepted but no connectionRef");
//       }
//     };

//     const handleIceCandidate = ({ candidate }) => {
//       if (connectionRef.current) {
//         // simple-peer uses .signal for ICE too when trickle:false/true patterns vary;
//         // but we keep this to forward candidate if necessary
//         connectionRef.current.signal(candidate);
//       }
//     };

//     socket.on("incoming-call", handleIncomingCall);
//     socket.on("call-accepted", handleCallAccepted);
//     socket.on("ice-candidate", handleIceCandidate);

//     return () => {
//       socket.off("incoming-call", handleIncomingCall);
//       socket.off("call-accepted", handleCallAccepted);
//       socket.off("ice-candidate", handleIceCandidate);

//       // cleanup peer on unmount
//       if (connectionRef.current) {
//         try {
//           connectionRef.current.destroy();
//         } catch (e) {
//           console.warn("error destroying peer:", e);
//         }
//         connectionRef.current = null;
//       }
//     };
//   }, []); // empty deps => attach once

//   // call user (caller)
//   const callUser = (targetId) => {
//     if (!streamRef.current) {
//       console.warn("No local stream yet - cannot call");
//       return;
//     }

//     // prevent creating multiple peers
//     if (connectionRef.current) {
//       console.warn("Connection already exists");
//       return;
//     }

//     const peer = new Peer({ initiator: true, trickle: false, stream: streamRef.current });

//     peer.on("signal", (offerData) => {
//       socket.emit("call-user", { targetUserId: targetId, offer: offerData });
//     });

//     peer.on("stream", (remoteStream) => {
//       if (userVideo.current) userVideo.current.srcObject = remoteStream;
//     });

//     peer.on("error", (err) => console.error("peer error (caller):", err));
//     peer.on("close", () => {
//       if (connectionRef.current === peer) connectionRef.current = null;
//       if (userVideo.current) userVideo.current.srcObject = null;
//     });

//     connectionRef.current = peer;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center space-y-4">
//       <video ref={myVideo} autoPlay muted className="w-60 h-40 rounded-lg shadow" />
//       <video ref={userVideo} autoPlay className="w-60 h-40 rounded-lg shadow" />
//       <button
//         onClick={() => callUser(targetUserId)}
//         className="px-4 py-2 bg-blue-500 text-white rounded-md"
//       >
//         Call User
//       </button>
//     </div>
//   );
// };

// export default VideoCall;




import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer-light";
import { socket } from "../../../socket";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

const VideoCall = (props) => {
  const { user } = useSelector((state) => state.auth);
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  const streamRef = useRef(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null); // { from, offer }
  const [callAccepted, setCallAccepted] = useState(false);

  const params = useParams();
  const location = useLocation();

  const propsRoomId = props.roomId;
  const propsTargetUserId = props.targetUserId;

  const roomId = propsRoomId || params.roomId;
  const targetUserId = propsTargetUserId || location.state?.targetUserId;

  console.log("VideoCall with roomId:", roomId, "targetUserId:", targetUserId);

  // 🎥 Get user media
  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        if (!mounted) return;
        streamRef.current = mediaStream;
        setHasCamera(true);
        if (myVideo.current) myVideo.current.srcObject = mediaStream;
      })
      .catch((err) => {
        console.error("getUserMedia error:", err);
      });

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // 🎧 Socket listeners
  useEffect(() => {
    const handleIncomingCall = ({ from, offer }) => {
      console.log("📞 Incoming call from:", from);
      setIncomingCall({ from, offer });
    };

    const handleCallAccepted = ({ answer }) => {
      console.log("✅ Call accepted signal received");
      if (connectionRef.current) {
        connectionRef.current.signal(answer);
      }
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);

      if (connectionRef.current) {
        connectionRef.current.destroy();
        connectionRef.current = null;
      }
    };
  }, []);

  // 📲 Caller initiates call
  const callUser = (targetId) => {
    if (!streamRef.current) return console.warn("Stream not ready");
    if (connectionRef.current) return console.warn("Connection exists");

    const peer = new Peer({ initiator: true, trickle: false, stream: streamRef.current });

    peer.on("signal", (offerData) => {
      socket.emit("call-user", { targetUserId: targetId, offer: offerData });
      console.log("📤 Sent call-user to target:", targetId);
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) userVideo.current.srcObject = remoteStream;
    });

    peer.on("error", (err) => console.error("peer error (caller):", err));
    connectionRef.current = peer;
  };

  // ✅ Callee accepts call
  const answerCall = () => {
    if (!incomingCall) return;
    const { from, offer } = incomingCall;
    console.log("📞 Answering call from:", from);

    const peer = new Peer({ initiator: false, trickle: false, stream: streamRef.current });

    peer.on("signal", (answerData) => {
      socket.emit("accept-call", { targetUserId: from, answer: answerData });
      console.log("📤 Sent accept-call to:", from);
      setCallAccepted(true);
      setIncomingCall(null);
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) userVideo.current.srcObject = remoteStream;
    });

    peer.signal(offer);
    connectionRef.current = peer;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <video ref={myVideo} autoPlay muted className="w-60 h-40 rounded-lg shadow" />
      <video ref={userVideo} autoPlay className="w-60 h-40 rounded-lg shadow" />

      {/* Caller Button */}
      {!incomingCall && (
        <button
          onClick={() => callUser(targetUserId)}
          disabled={!hasCamera || !targetUserId}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Call
        </button>
      )}

      {/* Incoming Call UI */}
      {incomingCall && !callAccepted && (
        <div className="flex flex-col items-center space-y-3">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Incoming call from User ID: {incomingCall.from}
          </p>
          <div className="flex gap-4">
            <button
              onClick={answerCall}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md"
            >
              ✅ Answer
            </button>
            <button
              onClick={() => setIncomingCall(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md"
            >
              ❌ Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;