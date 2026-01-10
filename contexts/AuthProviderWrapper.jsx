// contexts/AuthProviderWrapper.jsx
"use client"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"

export default function AuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
