"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Scissors, User, CheckCircle, Zap } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 py-8 lg:py-12">
      {/* 🔹 Main Container - Horizontal Layout */}
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* 🔹 Left Side - Welcome Section */}
          <div className="space-y-8 animate-fadeInLeft">
            {/* Logo & Branding */}
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-3xl text-white group-hover:text-teal-400 transition">BarberBook</span>
              </Link>
            </div>

            {/* Headlines */}
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Join BarberBook Today
              </h1>
              <p className="text-lg text-gray-400">
                Create your account and connect with professional barbers or book amazing services
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-4">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <User className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Book as Customer</h3>
                  <p className="text-gray-400 text-sm">Find and book appointments with professional barbers</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <Scissors className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Grow as Barber</h3>
                  <p className="text-gray-400 text-sm">Manage bookings and build your professional profile</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <CheckCircle className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">100% Secure</h3>
                  <p className="text-gray-400 text-sm">Your data is protected with industry-standard encryption</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-500/30 transition">
                  <Zap className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Instant Setup</h3>
                  <p className="text-gray-400 text-sm">Create account and start using in just a few minutes</p>
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
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