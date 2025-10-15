import { useNavigate } from "react-router-dom"
import { Card } from "../components/ui/Card.jsx"
import { BookOpen, BarChart3, PlusCircle, Edit, Pencil } from "lucide-react" // added Pencil for Edit Tests

const AdminHome = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Administrative Dashboard</h2>
        <p className="text-gray-600">Manage tests, add questions, and view analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Questions */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/addquestions")}
              className="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <PlusCircle className="w-6 h-6 text-blue-600" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add Questions</h3>
              <p className="text-gray-600">Create and manage question banks</p>
            </div>
          </div>
        </Card>

        {/* Create Tests */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/createtest")}
              className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Edit className="w-6 h-6 text-green-600" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create Tests</h3>
              <p className="text-gray-600">Set up new tests and assign questions</p>
            </div>
          </div>
        </Card>

        {/* Analytics */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-600">View test results and stats</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default AdminHome
