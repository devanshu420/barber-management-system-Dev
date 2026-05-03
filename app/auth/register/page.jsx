"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";
import { Scissors } from "lucide-react";

export default function RegisterPage() {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 sm:px-6 py-8">

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT SIDE (desktop only) */}
          <div className="hidden lg:flex flex-col space-y-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-3xl">
                BarberBook
              </span>
            </Link>

            <div>
              <h1 className="text-5xl font-bold text-white">
                Join BarberBook Today
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Create your account and start booking services
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full max-w-md mx-auto space-y-4">
            <RegisterForm />

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-teal-400 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}