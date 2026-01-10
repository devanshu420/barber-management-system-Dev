"use client"  // important for client-side components like useAuth

import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "leaflet/dist/leaflet.css"

import { AuthProvider } from "@/contexts/auth-context" // import your provider
import "./globals.css"

export const metadata = {
  title: "Barber Booking",
  description: "Created by Devanshu",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
