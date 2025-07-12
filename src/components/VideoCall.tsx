import React, { useEffect, useRef, useState } from "react";
import { initPeer } from "@/services/video/peer";
import { listenToSignal, sendSignal } from "@/services/video/signaling";

const VideoCall: React.FC<{ userId: string; roomId: string }> = ({
  userId,
  roomId,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenSharing, setScreenSharing] = useState(false);
  const [call, setCall] = useState<any>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null); // ✅ Define this

  useEffect(() => {
    const peer = initPeer();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }

        peer.on("call", (incomingCall) => {
          incomingCall.answer(mediaStream);
          incomingCall.on("stream", (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
          setCall(incomingCall);
        });
      });

    listenToSignal(roomId, (signalData) => {
      if (signalData.callerId !== userId) {
        const call = peer.call(signalData.callerId, stream!);
        call.on("stream", (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });
        setCall(call);
      }
    });
  }, [userId, roomId]);

  const startCall = async () => {
    await sendSignal(roomId, { callerId: userId });
  };

  const toggleScreenShare = async () => {
    // if (!call) return;

    if (!screenSharing) {
      //   const screenStream = await navigator.mediaDevices.getDisplayMedia({
      //     video: true,
      //   });
      //   const videoTrack = screenStream.getVideoTracks()[0];
      //   const sender = call.peerConnection
      //     .getSenders()
      //     .find((s) => s.track?.kind === "video");
      //   if (sender) {
      //     sender.replaceTrack(videoTrack);
      //   }
      //   videoTrack.onended = () => {
      //     toggleScreenShare(); // Revert back to webcam when screen share ends
      //   };
      //   setScreenSharing(true);
      // } else {
      //   const videoTrack = stream!.getVideoTracks()[0];
      //   const sender = call.peerConnection
      //     .getSenders()
      //     .find((s) => s.track?.kind === "video");
      //   if (sender) {
      //     sender.replaceTrack(videoTrack);
      //   }
      //   setScreenSharing(false);
      // }
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = stream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setScreenSharing(true);

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.error("Screen share error:", err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
    }
    setScreenSharing(false);

    // Restore camera stream if needed
    // You should already have a camera stream saved (e.g., in localStream)
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  };

  return (
    <div>
      <h2>Video Call - Room: {roomId}</h2>
      <video ref={localVideoRef} autoPlay muted playsInline width="300" />
      <video ref={remoteVideoRef} autoPlay playsInline width="300" />
      <div>
        <button onClick={startCall}>Start Call</button>
        <button onClick={toggleScreenShare}>
          {screenSharing ? "Stop Screen Share" : "Share Screen"}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
