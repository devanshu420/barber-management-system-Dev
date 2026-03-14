"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Scissors } from "lucide-react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("customer");

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: Content */}
        <div className="space-y-6 text-center lg:text-left">
          <Link
            href="/"
            className="inline-flex items-center space-x-3 group mb-4 justify-center lg:justify-start"
          >
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-3xl text-white group-hover:text-teal-400 transition">
              BarberBook
            </span>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Welcome back to your{" "}
              <span className="text-teal-400">barber hub</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0">
              Sign in to manage bookings, track your appointments, and keep your
              grooming journey on point.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="p-3 bg-linear-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-lg">
              <p className="text-teal-300 text-sm font-medium text-center">
                {selectedRole === "customer"
                  ? "👤 Customers can book and manage appointments with top barbers."
                  : "✂️ Barbers can manage schedules, clients, and services."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="w-full max-w-md mx-auto animate-fadeIn">
          <LoginForm role={selectedRole} />
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
