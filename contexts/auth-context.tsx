"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  dni: string
  role: "admin" | "client"
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isManager: boolean // Alias for isAdmin
  refreshUser: () => Promise<void>
  // Temporary stubs for backward compatibility - will be replaced with real implementations
  getAllUsers: () => any[]
  markPaymentAsPaid: (userId: string, month: string) => void
  deactivateUser: (userId: string) => void
  activateUser: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"
  const isManager = isAdmin // Alias for backward compatibility

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  useEffect(() => {
    if (!initialized) {
      fetchUser()
    }
  }, [initialized])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  // Temporary stubs - TODO: Replace with real API calls
  const getAllUsers = () => {
    console.warn("getAllUsers: stub function - will be replaced with real API")
    return []
  }

  const markPaymentAsPaid = (userId: string, month: string) => {
    console.warn("markPaymentAsPaid: stub function - will be replaced with real API")
  }

  const deactivateUser = (userId: string) => {
    console.warn("deactivateUser: stub function - will be replaced with real API")
  }

  const activateUser = (userId: string) => {
    console.warn("activateUser: stub function - will be replaced with real API")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        isAuthenticated,
        isAdmin,
        isManager,
        refreshUser,
        getAllUsers,
        markPaymentAsPaid,
        deactivateUser,
        activateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
