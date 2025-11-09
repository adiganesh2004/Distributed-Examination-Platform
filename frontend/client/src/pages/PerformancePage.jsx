import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card.jsx";
import { BarChart3, User, Clock } from "lucide-react";

const BACKEND_URL = `${import.meta.env.VITE_API_URL}`;

const PerformancePage = () => {
  const { testId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${BACKEND_URL}/results/candidate/${testId}/performance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Unable to fetch performance");

        setData(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerf();
  }, [testId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Test Performance
      </h1>

      <Card className="p-8 shadow-lg bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <User className="w-8 h-8 text-blue-600" />
            <p className="text-xl font-semibold text-gray-900">
              {data.candidateName}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <p className="text-xl font-semibold text-gray-900">
              Score: {data.score}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-purple-600" />
            <p className="text-xl font-semibold text-gray-900">
              Avg Time Per Question: {data.avgTimePerQuestion.toFixed(2)} sec
            </p>
          </div>

          <p className="text-lg text-gray-800">
            Total Questions: <span className="font-semibold">{data.totalQuestions}</span>
          </p>

          <p className="text-lg text-gray-800">
            Correct Answers: <span className="font-semibold">{data.correctAnswers}</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PerformancePage;
