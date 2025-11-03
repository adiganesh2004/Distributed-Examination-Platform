import React, { useEffect, useRef, useState } from "react";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

const TestTaking = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:${BACKEND_PORT}/testtake`);

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setMessages((prev) => [...prev, "Connected to server"]);
    };

    socket.onmessage = (event) => {
      console.log("📩 Received:", event.data);
      setMessages((prev) => [...prev, "Server: " + event.data]);
    };

    socket.onclose = () => {
      console.log("❌ Connection closed");
      setMessages((prev) => [...prev, "Connection closed"]);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setMessages((prev) => [...prev, "WebSocket error"]);
    };

    socketRef.current = socket;

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
      setMessages((prev) => [...prev, "You: " + input]);
      setInput("");
    } else {
      alert("WebSocket is not connected!");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>🧠 Test Taking WebSocket Demo</h2>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          backgroundColor: "#f7f7f7",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: "10px" }}>
        <input
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default TestTaking