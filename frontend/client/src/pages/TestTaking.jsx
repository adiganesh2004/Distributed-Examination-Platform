import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;
const BACKEND_WS_URL = `ws://localhost:${BACKEND_PORT}/testtake/`;
const BACKEND_WS_URL2 = `ws://localhost:${BACKEND_PORT}/proctorer/`;
const BACKEND_URL = `${import.meta.env.VITE_API_URL}`;

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState(null);
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const questionsRef = useRef(questions);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const wsRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    const allowed = sessionStorage.getItem("cameraAllowed");
    if (!allowed) {
      navigate("/home");
      return;
    }

    let stream = null;
    let intervalId = null;

    async function startCamera() {
      try {
        console.log("Camera starting")
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;

        // Start the interval *after* the stream is ready
        intervalId = setInterval(() => captureAndSend(stream), 10000);
      } catch (err) {
        console.error("Camera start error", err);
        navigate("/home");
      }
    }

    startCamera();

    // Cleanup when component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [navigate, testId]);

  async function captureAndSend() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
  
    const ctx = canvas.getContext("2d");
    canvas.width = 100; // reduce resolution
    canvas.height = 100;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.4);
  
    const data = {
      type: "proctor",
      testId,
      token: localStorage.getItem("token"),
      imageBase64,
    };
  
    sendOverWS(data);
  }

  function sendOverWS(data) {
    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn("⚠️ WS not ready, skipping send");
        return;
      }
      wsRef.current.send(JSON.stringify(data));
    } catch (error) {
      console.error("❌ sendOverWS error:", error);
    }
  }

  // Connect WebSocket
  useEffect(() => {
    if (!user || !user.token) return;

    const ws = new WebSocket(BACKEND_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);

      const startMessage = {
        token: token,
        type: "start_test",
        testId: testId,
      };
      ws.send(JSON.stringify(startMessage));
    };

    ws.onmessage = (event) => {
      console.log("📩 Message from server:", event.data);
      try {
        const data = JSON.parse(event.data);
        setIsWaiting(false);

        if (data.error) {
          alert(`❌ Error: ${data.error}`);
          return;
        }

        // ✅ Change question confirmation
        if (data.nextQuestionId) {
          const nextIndex = questionsRef.current.findIndex(q => q.id === data.nextQuestionId);
          if (nextIndex !== -1) {
            setCurrentIndex(nextIndex);
            setCurrentQuestion(questionsRef.current[nextIndex]);
            setChosenOption(null);
          } else {
            console.warn("⚠️ Question not found for ID:", data.nextQuestionId);
          }
          return;
        }

        // ✅ Change answer confirmation
        if (data.chosenOption !== undefined) {
          setChosenOption(data.chosenOption);
          return;
        }

        // ✅ End test confirmation
        if (data.status === "success" && data.message) {
          alert(`✅ ${data.message}`);
          navigate("/home");
          return;
        }

        // ✅ Test initialization
        if (data.questions && Array.isArray(data.questions)) {
          const newQuestions = data.questions;
          setQuestions(() => {
            // return new array to update state
            return newQuestions;
          });
          setTestName(data.testName || "Untitled Test");
          setDescription(data.description || "No description provided.");
          setDuration(data.duration || 0);
          setTimeLeft((data.duration || 0) * 60);
          setQuestions(newQuestions);
          setCurrentIndex(0);
          setCurrentQuestion(data.questions[0]);
          return;
        }

        console.log("⚙️ Unhandled message:", data);
      } catch (err) {
        console.error("❌ Error parsing message:", err);
        setIsWaiting(false); // ensure UI isn’t stuck
      }
    };


    ws.onerror = (error) => console.error("⚠️ WebSocket error:", error);
    ws.onclose = () => {
      console.log("🔒 WebSocket closed");
      setConnected(false);
    };

    setSocket(ws);

    return () => ws.close();
  }, [user, testId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("⏰ Time's up!");
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (optionIndex) => {
    if (!connected || !wsRef.current || !currentQuestion || isWaiting) return;
    setIsWaiting(true);

    const message = {
      token,
      type: "change_answer",
      testId,
      currentQuestionId: currentQuestion.id,
      chosenOption: optionIndex,
    };

    wsRef.current.send(JSON.stringify(message));
  };


  const handleNextQuestion = () => {
    if (!connected || !wsRef.current || questions.length === 0 || isWaiting) return;
    setIsWaiting(true);

    const nextIndex = (currentIndex + 1) % questions.length;

    const message = {
      token,
      type: "change_question",
      testId,
      currentQuestionId: questions[currentIndex].id,
      nextQuestionId: questions[nextIndex].id,
    };

    wsRef.current.send(JSON.stringify(message));
  };


  const handlePrevQuestion = () => {
    if (!connected || !wsRef.current || questions.length === 0 || isWaiting) return;
    setIsWaiting(true);

    const prevIndex = (currentIndex - 1 + questions.length) % questions.length;

    const message = {
      token,
      type: "change_question",
      testId,
      currentQuestionId: questions[currentIndex].id,
      nextQuestionId: questions[prevIndex].id,
    };
    console.log(message)
    wsRef.current.send(JSON.stringify(message));
  };


  const handleSubmitTest = () => {
    if (!connected || !wsRef.current || isWaiting) return;
    setIsWaiting(true);

    const message = {
      token,
      type: "end_test",
      testId,
    };

    wsRef.current.send(JSON.stringify(message));
  };


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <video ref={videoRef} autoPlay playsInline className="w-64 h-48 border" />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {!connected ? (
        <p>Connecting to test server...</p>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{testName}</h2>
            <p className="text-gray-700 mb-2">{description}</p>
            <div className="text-right text-gray-800 font-semibold">
              ⏱️ Time Left: {formatTime(timeLeft)}
            </div>
          </div>

          {currentQuestion ? (
            <div className="border p-4 rounded-lg shadow relative">
              {isWaiting && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-lg font-semibold z-10">
                  ⏳ Waiting for server confirmation...
                </div>
              )}

              <h3 className="font-bold mb-3">
                Q{currentIndex + 1}. {currentQuestion.question || "Question text here"}
              </h3>
              <ul>
                {(currentQuestion.options || []).map((opt, idx) => (
                  <li key={idx} className="my-1">
                    <label className={`${isWaiting ? "opacity-60" : ""}`}>
                      <input
                        type="radio"
                        name="option"
                        disabled={isWaiting}
                        checked={chosenOption === idx}
                        onChange={() => handleAnswerChange(idx)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrevQuestion}
                  disabled={isWaiting}
                  className={`px-4 py-2 rounded text-white ${isWaiting ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500"
                    }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={isWaiting}
                  className={`px-4 py-2 rounded text-white ${isWaiting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600"
                    }`}
                >
                  Next
                </button>
              </div>

              <button
                onClick={handleSubmitTest}
                disabled={isWaiting}
                className={`mt-6 w-full px-4 py-2 rounded text-white ${isWaiting ? "bg-green-300 cursor-not-allowed" : "bg-green-600"
                  }`}
              >
                Submit Test
              </button>
            </div>
          ) : (
            <p>Waiting for test to start...</p>
          )}

        </>
      )}
    </div>
  );
};

export default TestTaking;
