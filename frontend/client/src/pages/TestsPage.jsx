import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = `${import.meta.env.VITE_API_URL}`;

const TestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in.");
      setLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/tests/getcurrent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch tests");
        const data = await res.json();
        setTests(data);
        console.log(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading tests...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Available Tests</h1>

      {tests.length === 0 ? (
        <p className="text-center text-gray-500">No active tests available.</p>
      ) : (
        <ul className="space-y-4">
          {tests.map((t) => (
            <li
              key={t.id}
              className="p-4 bg-white shadow-md rounded-xl hover:bg-gray-100 cursor-pointer transition"
              onClick={() => navigate(`/starttest/${t.id}`)}
            >
              <h2 className="text-lg font-medium">{t.name || "Untitled Test"}</h2>
              <p className="text-gray-600">{t.description || "No description provided."}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestsPage;
