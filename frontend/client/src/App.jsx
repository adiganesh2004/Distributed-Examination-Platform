import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import CandidateLogin from "./pages/CandidateLogin.jsx"
import AdminLogin from "./pages/AdminLogin.jsx"
import Home from "./pages/Home.jsx"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/candidate-login" replace />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
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
