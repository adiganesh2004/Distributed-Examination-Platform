import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx"

import TestsPage from "./pages/TestsPage.jsx";
import Navbar from "./components/Navbar.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import CandidateLogin from "./pages/CandidateLogin.jsx"
import AdminLogin from "./pages/AdminLogin.jsx"
import Signup from "./pages/Signup.jsx"
import Home from "./pages/Home.jsx"
import AddQuestions from "./pages/AddQuestions.jsx"
import CreateTest from "./pages/CreateTest.jsx"
import DeleteQuestion from "./pages/DeleteQuestion.jsx" 
import TestTaking from "./pages/TestTaking.jsx"
import ResultsPage from "./pages/ResultsPage.jsx" 
import PerformancePage from "./pages/PerformancePage.jsx";
import AdminAnalyticsDashboard from "./pages/AdminAnalyticsDashboard.jsx";
import AdminTestsList from "./pages/AdminTestsLists.jsx";
import StartTest from "./pages/StartTest.jsx";

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

          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <TestsPage />
              </ProtectedRoute>
            }
          />

              <Route
                path="/testtake/:testId"
                element={
                  <ProtectedRoute>
                    <TestTaking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <ResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
              path="/results/:testId/performance"
              element={
                <ProtectedRoute>
                  <PerformancePage />
                </ProtectedRoute>
              }
              />
              <Route
                path="/admin/tests"
                element={
                  <ProtectedAdminRoute>
                    <AdminTestsList />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/analytics/:testId"
                element={
                  <ProtectedAdminRoute>
                    <AdminAnalyticsDashboard />
                  </ProtectedAdminRoute>
                }
              />
          <Route
            path="/testtake/:testId"
            element={
              <ProtectedRoute>
                <TestTaking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/starttest/:testId"
            element={
              <ProtectedRoute>
                <StartTest />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
