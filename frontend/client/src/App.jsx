import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx"

import Navbar from "./components/Navbar.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import CandidateLogin from "./pages/CandidateLogin.jsx"
import AdminLogin from "./pages/AdminLogin.jsx"
import Signup from "./pages/Signup.jsx"
import Home from "./pages/Home.jsx"
import AddQuestions from "./pages/AddQuestions.jsx"
import CreateTest from "./pages/CreateTest.jsx"
import DeleteQuestion from "./pages/DeleteQuestion.jsx" 

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/candidate-signup" element={<Signup role="candidate" />} />
          <Route path="/admin-signup" element={<Signup role="admin" />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addquestions"
            element={
              <ProtectedAdminRoute>
                <AddQuestions />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/createtest"
            element={
              <ProtectedAdminRoute>
                <CreateTest />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/deletequestions"
            element={
              <ProtectedAdminRoute>
                <DeleteQuestion />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
