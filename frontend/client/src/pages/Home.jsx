"use client"
import { useAuth } from "../hooks/useAuth.jsx"
import { Button } from "../components/ui/Button.jsx"
import { User, Shield, LogOut } from "lucide-react"
import AdminHome from "../components/AdminHome.jsx"
import CandidateHome from "../components/CandidateHome.jsx"

const Home = () => {
  const { user, logout } = useAuth()
  const isAdmin = user?.userType === "admin"

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* {isAdmin ? <AdminHome /> : <CandidateHome />} */}
        <AdminHome/>
        <CandidateHome/>
      </main>
    </div>
  )
}

export default Home
