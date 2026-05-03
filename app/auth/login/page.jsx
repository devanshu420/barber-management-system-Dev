"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("customer");
  const [googleError, setGoogleError] = useState("");

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* ================= LEFT SECTION (DESKTOP ONLY) ================= */}
          <div className="hidden lg:flex flex-col space-y-6 text-left">

            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-3xl text-white group-hover:text-teal-400 transition">
                BarberBook
              </span>
            </Link>

            {/* Heading */}
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Welcome back to your{" "}
                <span className="text-teal-400">barber hub</span>
              </h1>

              <p className="mt-4 text-gray-400 max-w-md">
                Sign in to manage bookings, track your appointments, and keep
                your grooming journey on point.
              </p>
            </div>

            {/* Info box */}
            <div className="max-w-md">
              <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <p className="text-teal-300">
                  {selectedRole === "customer"
                    ? "👤 Customers can book & manage appointments."
                    : "✂️ Barbers manage schedules & clients."}
                </p>
              </div>
            </div>

            {/* Error */}
            {googleError && (
              <p className="text-red-400">
                {googleError}
              </p>
            )}
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="w-full max-w-md mx-auto">
            
            {/* Login Card */}
            <div>
              <LoginForm role={selectedRole} />
            </div>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}