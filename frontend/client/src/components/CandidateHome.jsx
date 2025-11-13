import { Card } from "../components/ui/Card.jsx";
import { BookOpen, BarChart3, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CandidateHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Dashboard</h2>
        <p className="text-gray-600">Access your tests and view your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🧩 Available Tests Card */}
        <Card
          onClick={() => navigate("/tests")}
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Available Tests
              </h3>
              <p className="text-gray-600">View and take your tests</p>
            </div>
          </div>
        </Card>

        {/* My Results Card */}
        <Card
          onClick={() => navigate("/results")}
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Results</h3>
              <p className="text-gray-600">View your test scores</p>
            </div>
          </div>
        </Card>

      </div>
    </>
  );
};

export default CandidateHome;
