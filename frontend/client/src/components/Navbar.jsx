import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.jsx"
import { Brain, Shield, User, LogOut } from "lucide-react"
import { Button } from "../components/ui/Button.jsx"
const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate("/home")
  }

  const isAdmin = user?.userType === "admin"

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo */}
        <div className="flex justify-between items-center h-16">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="bg-white rounded-full p-1 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              IQ Arena
            </span>
          </button>

          {/* Right side: user info and logout */}
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white opacity-90">
                Welcome, {user.email}
              </span>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-transparent border-white text-white hover:bg-white hover:text-blue-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
