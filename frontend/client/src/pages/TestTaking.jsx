import React, { useEffect, useRef, useState } from "react";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

const TestTaking = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  // Questions will come from backend
  const [questions, setQuestions] = useState([]); // TODO: Populate from backend WebSocket
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // 🔌 Connect to WebSocket
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:${BACKEND_PORT}/testtake`);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      setConnected(true);
      setMessages((prev) => [...prev, "Connected to server"]);

      // Optionally: request questions from backend
      socket.send(JSON.stringify({ action: "REQUEST_QUESTIONS" }));
    };

    socket.onmessage = (event) => {
      console.log("Received:", event.data);
      setMessages((prev) => [...prev, "Server: " + event.data]);

      try {
        const data = JSON.parse(event.data);

        // TODO: Backend can send { type: "QUESTIONS", payload: [...] }
        if (data.type === "QUESTIONS") {
          setQuestions(data.payload);
        }
      } catch (err) {
        console.warn("Non-JSON message from server:", event.data);
      }
    };

    socket.onclose = () => {
      console.log("Connection closed");
      setConnected(false);
      setMessages((prev) => [...prev, "Connection closed"]);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setMessages((prev) => [...prev, "WebSocket error"]);
    };

    socketRef.current = socket;
    return () => socket.close();
  }, []);

  // Send timestamp to backend
  const sendTimestamp = (actionType) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        action: actionType, // "NEXT" or "SUBMIT"
        questionId: questions[currentQ]?.id || null,
        timestamp: new Date().toISOString(),
        selectedOption,
      };
      socketRef.current.send(JSON.stringify(payload));
      setMessages((prev) => [
        ...prev,
        `You: ${actionType} at ${payload.timestamp}`,
      ]);
    } else {
      alert("WebSocket not connected!");
    }
  };
  const handleNext = () => {
    sendTimestamp("NEXT");
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setSubmitted(true);
      sendTimestamp("SUBMIT");
    }
  };
  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
        <h2>Test Submitted!</h2>
        <p>All timestamps sent to backend successfully.</p>
      </div>
    );
  }

  // 🕳️ Handle when questions not yet loaded
  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
        <h2>Test Taking System</h2>
        <p style={{ color: connected ? "green" : "red" }}>
          {connected ? "Waiting for questions from backend..." : "Connecting..."}
        </p>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Test Taking System</h2>
      <p style={{ color: connected ? "green" : "red" }}>
        {connected ? "Connected to server" : "Connecting..."}
      </p>

      {/* Question Section */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
          background: "#f9f9f9",
        }}
      >
        <h3>
          Question {currentQ + 1} of {questions.length}
        </h3>
        <p>{q.text}</p>

        {q.options?.map((opt, i) => (
          <label
            key={i}
            style={{
              display: "block",
              margin: "8px 0",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={`q${q.id}`}
              value={opt}
              checked={selectedOption === opt}
              onChange={() => setSelectedOption(opt)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: selectedOption ? "pointer" : "not-allowed",
          }}
        >
          {currentQ === questions.length - 1 ? "Submit Test" : "Next"}
        </button>
      </div>

      {/* Log messages */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          marginTop: "20px",
          height: "150px",
          overflowY: "auto",
          backgroundColor: "#fafafa",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default TestTaking;
