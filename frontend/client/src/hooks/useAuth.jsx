"use client"

import { createContext, useContext, useState, useEffect } from "react"

const BACKEND_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password, userType) => {
    try {
      // Simulate API call to backend
      const response = await fetch(`${BACKEND_URL}/auth/${userType}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType }),
      },)

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
