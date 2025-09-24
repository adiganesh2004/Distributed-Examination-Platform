import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.jsx"
import { Brain } from "lucide-react" // logo icon

const Navbar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogoClick = () => {
    if (user) {
      navigate("/home")
    } else {
      navigate("/")
    }
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </div>
    </header>
  )
}

export default Navbar