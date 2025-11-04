"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Scissors, User } from "lucide-react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("customer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex flex-col items-center justify-center px-4 py-12">
      {/* 🔹 Header with Logo */}
      <div className="mb-12 text-center">
        <Link href="/" className="inline-flex items-center space-x-3 group mb-8">
          <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition">
            <Scissors className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-3xl text-white group-hover:text-teal-400 transition">BarberBook</span>
        </Link>
        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
          Welcome Back
        </h1>
        <p className="text-lg text-gray-400 max-w-lg mx-auto">
          Sign in to your account and continue your barber journey
        </p>
      </div>

      {/* 🔹 Role Selection Tabs */}
      <div className="w-full max-w-md mb-6">
        <div className="grid grid-cols-2 gap-3 p-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <button
            onClick={() => setSelectedRole("customer")}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-semibold transition duration-300 text-sm ${
              selectedRole === "customer"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-black shadow-lg scale-105"
                : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>
          <button
            onClick={() => setSelectedRole("barber")}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-semibold transition duration-300 text-sm ${
              selectedRole === "barber"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-black shadow-lg scale-105"
                : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Barber</span>
          </button>
        </div>
      </div>

      {/* 🔹 Role Description */}
      <div className="w-full max-w-md mb-6">
        <div className="p-3 bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-lg">
          <p className="text-teal-300 text-sm font-medium text-center">
            {selectedRole === "customer"
              ? "👤 Sign in to book appointments with professional barbers"
              : "✂️ Sign in to manage your barber services and bookings"}
          </p>
        </div>
      </div>

      {/* 🔹 Form Container - Centered */}
      <div className="w-full max-w-md animate-fadeIn">
        <LoginForm role={selectedRole} />
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