import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import CandidateLogin from "./pages/CandidateLogin.jsx"
import AdminLogin from "./pages/AdminLogin.jsx"
import Home from "./pages/Home.jsx"
import Signup from "./pages/Signup.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import Navbar from "./components/Navbar.jsx"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <Routes>
          {/* Routes with navbar */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <LandingPage />
              </>
            }
          />
          <Route
            path="/candidate-login"
            element={
              <>
                <Navbar />
                <CandidateLogin />
              </>
            }
          />
          <Route
            path="/admin-login"
            element={
              <>
                <Navbar />
                <AdminLogin />
              </>
            }
          />
          <Route
            path="/candidate-signup"
            element={
              <>
                <Navbar />
                <Signup role="candidate" />
              </>
            }
          />
          <Route
            path="/admin-signup"
            element={
              <>
                <Navbar />
                <Signup role="admin" />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
