"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.jsx"

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return user?.userType === "admin" ? children : <Navigate to="/home" replace />
}

export default ProtectedAdminRoute
