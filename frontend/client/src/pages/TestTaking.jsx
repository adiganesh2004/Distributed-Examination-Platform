import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;
const BACKEND_WS_URL = `ws://localhost:${BACKEND_PORT}/testtake/`;

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
  const [messageLog, setMessageLog] = useState([]);
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const wsRef = useRef(null);
  const token = localStorage.getItem("token");

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
        setMessageLog((prev) => [...prev, data]);

        // 🔴 Handle error messages
        if (data.error) {
          alert(`Error: ${data.error}`);
          navigate("/home");
          return;
        }

        // ✅ Initialize test data
        if (data.questions && Array.isArray(data.questions)) {
          setTestName(data.testName || "Untitled Test");
          setDescription(data.description || "No description provided.");
          setDuration(data.duration || 0);
          setTimeLeft((data.duration || 0) * 60); // convert minutes → seconds
          setQuestions(data.questions);
          setCurrentIndex(0);
          setCurrentQuestion(data.questions[0]);
        }
      } catch (err) {
        console.error("❌ Error parsing message:", err);
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

  // Handle answer change
  const handleAnswerChange = (optionIndex) => {
    if (!connected || !wsRef.current || !currentQuestion) return;

    setChosenOption(optionIndex);

    const message = {
      token: token,
      type: "change_answer",
      testId: testId,
      currentQuestionId: currentQuestion.id,
      chosenOption: optionIndex,
    };

    console.log("📤 Sending change_answer message:", message);
    wsRef.current.send(JSON.stringify(message));
  };

  // Next question (circular)
  const handleNextQuestion = () => {
    if (!connected || !wsRef.current || questions.length === 0) return;

    const nextIndex = (currentIndex + 1) % questions.length;
    setCurrentIndex(nextIndex);
    setCurrentQuestion(questions[nextIndex]);
    setChosenOption(null);

    const message = {
      token: token,
      type: "change_question",
      testId: testId,
      currentQuestionId: questions[currentIndex].id,
      nextQuestionId: questions[nextIndex].id,
    };

    console.log("📤 Sending change_question (next) message:", message);
    wsRef.current.send(JSON.stringify(message));
  };

  // Previous question (circular)
  const handlePrevQuestion = () => {
    if (!connected || !wsRef.current || questions.length === 0) return;

    const prevIndex = (currentIndex - 1 + questions.length) % questions.length;
    setCurrentIndex(prevIndex);
    setCurrentQuestion(questions[prevIndex]);
    setChosenOption(null);

    const message = {
      token: token,
      type: "change_question",
      testId: testId,
      currentQuestionId: questions[currentIndex].id,
      nextQuestionId: questions[prevIndex].id,
    };

    console.log("📤 Sending change_question (prev) message:", message);
    wsRef.current.send(JSON.stringify(message));
  };

  // Submit test
  const handleSubmitTest = () => {
    if (!connected || !wsRef.current) return;

    const message = {
      token: token,
      type: "end_test",
      testId: testId,
    };

    console.log("📤 Sending end_test message:", message);
    wsRef.current.send(JSON.stringify(message));

    alert("✅ Test submitted successfully!");
    navigate("/home");
  };


  return (
    <div className="p-6 max-w-3xl mx-auto">
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
            <div className="border p-4 rounded-lg shadow">
              <h3 className="font-bold mb-3">
                Q{currentIndex + 1}. {currentQuestion.question || "Question text here"}
              </h3>
              <ul>
                {(currentQuestion.options || []).map((opt, idx) => (
                  <li key={idx} className="my-1">
                    <label>
                      <input
                        type="radio"
                        name="option"
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
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Previous
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>

              <button
                onClick={handleSubmitTest}
                className="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit Test
              </button>
            </div>
          ) : (
            <p>Waiting for test to start...</p>
          )}

          <div className="mt-6">
            <h4 className="font-semibold">Message Log:</h4>
            <pre className="bg-gray-100 p-2 rounded text-sm max-h-60 overflow-auto">
              {JSON.stringify(messageLog, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

export default TestTaking;
