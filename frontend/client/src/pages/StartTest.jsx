"use client"
import { useAuth } from "../hooks/useAuth.jsx"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams  } from "react-router-dom";

const StartTest = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();
  const {testId} = useParams();

  useEffect(() => {
    // Ask for camera permission
    async function getCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        alert("Camera permission denied!");
        console.error(err);
      }
    }
    getCamera();
  }, []);

  const handleStartTest = () => {
    // Pass stream to next page via sessionStorage
    // (We can't directly pass MediaStream between pages)
    sessionStorage.setItem("cameraAllowed", "true");
    navigate(`/testtake/${testId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Start Your Test</h1>
      <video ref={videoRef} autoPlay playsInline className="w-64 h-48 border" />
      <button
        onClick={handleStartTest}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Start Test
      </button>
    </div>
  );
}

export default StartTest
