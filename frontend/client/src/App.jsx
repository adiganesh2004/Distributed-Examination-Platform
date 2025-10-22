import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import CandidateLogin from "./pages/CandidateLogin.jsx"
import AdminLogin from "./pages/AdminLogin.jsx"
import Home from "./pages/Home.jsx"
import Signup from "./pages/Signup.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import Navbar from "./components/Navbar.jsx"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx"
import AddQuestions from "./pages/AddQuestions.jsx"
import CreateTest from "./pages/CreateTest.jsx"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        
      <Navbar/>
        <Routes>
          {/* Routes with navbar */}
          <Route
            path="/"
            element={
              <>
                <LandingPage />
              </>
            }
          />
          <Route
            path="/candidate-login"
            element={
              <>
                <CandidateLogin />
              </>
            }
          />
          <Route
            path="/admin-login"
            element={
              <>
                <AdminLogin />
              </>
            }
          />
          <Route
            path="/candidate-signup"
            element={
              <>
                <Signup role="candidate" />
              </>
            }
          />
          <Route
            path="/admin-signup"
            element={
              <>
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
          <Route
            path="/addquestions"
            element={
              <ProtectedAdminRoute>
                <AddQuestions/>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/createtest"
            element={
              <ProtectedAdminRoute>
              <CreateTest/>
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
