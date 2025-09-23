import { Link } from "react-router-dom"
import { Card } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { User, Shield } from "lucide-react"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl">
        <Card className="p-8 flex flex-col items-center space-y-4 bg-white shadow-xl">
          <User className="w-12 h-12 text-blue-600" />
          <h2 className="text-xl font-bold">Candidate</h2>
          <p className="text-gray-600 text-center">Sign up as a candidate to take tests and track your progress.</p>
          <Link to="/candidate-signup" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Candidate Signup</Button>
          </Link>
        </Card>

        <Card className="p-8 flex flex-col items-center space-y-4 bg-white shadow-xl">
          <Shield className="w-12 h-12 text-indigo-600" />
          <h2 className="text-xl font-bold">Admin</h2>
          <p className="text-gray-600 text-center">Sign up as an admin to create and manage tests.</p>
          <Link to="/admin-signup" className="w-full">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Admin Signup</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default LandingPage
