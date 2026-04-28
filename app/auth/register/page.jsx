"use client";

import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Scissors, User, CheckCircle, Zap } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 sm:px-6 py-8">
      {/* 🔹 Main Container - Horizontal Layout */}
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* 🔹 Left Side - Welcome Section */}
          <div className="space-y-6 sm:space-y-8 animate-fadeInLeft">
            {/* Logo & Branding */}
            <div className="space-y-3 sm:space-y-4">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 sm:space-x-3 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition">
                  <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="font-bold text-2xl sm:text-3xl text-white group-hover:text-teal-400 transition">
                  BarberBook
                </span>
              </Link>
            </div>

            {/* Headlines */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Join BarberBook Today
              </h1>
              <p className="text-base sm:text-lg text-gray-400">
                Create your account and connect with professional barbers or
                book amazing services
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
              {/* Feature 1 */}
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    Book as Customer
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Find and book appointments with professional barbers
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    Grow as Barber
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Manage bookings and build your professional profile
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    100% Secure
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Your data is protected with industry-standard encryption
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    Instant Setup
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Create account and start using in just a few minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 sm:pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-xs sm:text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-teal-400 font-semibold hover:text-teal-300 transition"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* 🔹 Right Side - Registration Card */}
          <div className="animate-fadeInRight">
            <RegisterForm />
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out forwards;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out forwards 0.1s;
        }
        @keyframes fadeInLeft {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          0% {
            opacity: 0;
            transform: translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
