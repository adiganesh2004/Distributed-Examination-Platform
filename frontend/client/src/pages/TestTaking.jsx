import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const BACKEND_WS_URL =  "ws://localhost:32731/testtake";
console.log(BACKEND_WS_URL);

const TestTaking = () => {
  const { testId } = useParams();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [chosenOption, setChosenOption] = useState(null);
  const [messageLog, setMessageLog] = useState([]);
  const wsRef = useRef(null);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (!user || !user.token) return;

    const ws = new WebSocket(BACKEND_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);

      // Start test message
      const startMessage = {
        token: user.token,
        type: "start_test",
        testId: testId,
      };
      ws.send(JSON.stringify(startMessage));
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      try {
        const data = JSON.parse(event.data);
        setMessageLog((prev) => [...prev, data]);

        // If the backend sends question data, update UI
        if (data.question) {
          setCurrentQuestion(data.question);
          setQuestions((prev) => [...prev, data.question]);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => {
      console.log("WebSocket closed");
      setConnected(false);
    };

    setSocket(ws);

    return () => ws.close();
  }, [user, testId]);

  // Handle changing answers
  const handleAnswerChange = (optionIndex) => {
    if (!connected || !wsRef.current || !currentQuestion) return;

    setChosenOption(optionIndex);

    const message = {
      token: user.token,
      type: "change_answer",
      testId: testId,
      currentQuestionId: currentQuestion.id,
      chosenOption: optionIndex,
    };
    wsRef.current.send(JSON.stringify(message));
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    if (!connected || !wsRef.current || !currentQuestion) return;

    const message = {
      token: user.token,
      type: "next_question",
      testId: testId,
      currentQuestionId: currentQuestion.id,
      nextQuestionId: "some_next_question_id", // backend may provide next IDs dynamically
    };
    wsRef.current.send(JSON.stringify(message));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Test Taking: {testId}</h2>

      {!connected ? (
        <p>Connecting to test server...</p>
      ) : (
        <>
          {currentQuestion ? (
            <div className="border p-4 rounded-lg shadow">
              <h3 className="font-bold mb-3">{currentQuestion.questionText || "Question text here"}</h3>
              <ul>
                {(currentQuestion.options || []).map((opt, idx) => (
                  <li key={idx}>
                    <label>
                      <input
                        type="radio"
                        name="option"
                        checked={chosenOption === idx}
                        onChange={() => handleAnswerChange(idx)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleNextQuestion}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Next Question
              </button>
            </div>
          ) : (
            <p>Waiting for test to start or first question...</p>
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
