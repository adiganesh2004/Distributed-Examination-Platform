import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = `${import.meta.env.VITE_API_URL}`;

const ResultsPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized. Please log in.");
        }

        const res = await fetch(`${BACKEND_URL}/results/candidate/tests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Failed to fetch results");
        }

        const resultsList = await res.json();
        setTests(resultsList);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-black mb-6">Your Results</h1>

      {loading && <p className="text-gray-200">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => {
          const isEnded = new Date(test.endTime) < new Date();

          return (
           <Card
              key={test.testId}
              onClick={() => navigate(`/results/${test.testId}/performance`)}
              className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 
                        rounded-xl shadow-sm hover:shadow-xl transition-all 
                        cursor-pointer text-center max-w-xs"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {test.testName}
              </h2>

              <div className="mt-4 text-lg font-semibold">
                {isEnded ? (
                  <span className="text-green-700">Completed</span>
                ) : (
                  <span className="text-orange-700">Ongoing</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
