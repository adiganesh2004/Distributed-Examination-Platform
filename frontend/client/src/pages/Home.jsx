"use client"
import { useAuth } from "../hooks/useAuth.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Card } from "../components/ui/Card.jsx"
import { User, Shield, LogOut, BookOpen, Users, BarChart3 } from "lucide-react"

const Home = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const isAdmin = user?.userType === "admin"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {isAdmin ? <Shield className="w-8 h-8 text-red-600" /> : <User className="w-8 h-8 text-blue-600" />}
              <h1 className="text-xl font-semibold text-gray-900">{isAdmin ? "Admin Dashboard" : "Test Platform"}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isAdmin ? "Administrative Dashboard" : "Your Dashboard"}
          </h2>
          <p className="text-gray-600">
            {isAdmin ? "Manage tests, candidates, and view analytics" : "Access your tests and view your progress"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin ? (
            <>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manage Candidates</h3>
                    <p className="text-gray-600">View and manage test takers</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Test Management</h3>
                    <p className="text-gray-600">Create and edit tests</p>
                  </div>
                </div>
              </Card>

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
            </>
          ) : (
            <>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Available Tests</h3>
                    <p className="text-gray-600">View and take your tests</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
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

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                    <p className="text-gray-600">Manage your account</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
