
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Scissors,
  LogOut,
  ArrowLeft,
  Edit,
  Shield,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Load user data from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      const userRole = localStorage.getItem("userRole");
      const booking = localStorage.getItem("userBookings") || 0;

      // Redirect to login if not authenticated
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Set user data (you can fetch from API for more details)
      setUserData({
        name: userName,
        role: userRole,
        email: localStorage.getItem("userEmail") || "user@example.com",
        phone: localStorage.getItem("userPhone") || "+91 9876543210",
        profilePhoto: null,
        walletBalance: 500,
        loyaltyPoints: 250,
        isEmailVerified: true,
        isPhoneVerified: true,
        joinDate: new Date().toLocaleDateString(),
        bookings: booking,
        reviews: 8,
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🔹 Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userBookings");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/20 mb-4">
            <Scissors className="w-6 h-6 text-teal-400 animate-spin" />
          </div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Unable to load user data</p>
          <Button onClick={() => router.push("/")} className="bg-teal-500 hover:bg-teal-600">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* 🔹 Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-teal-400 hover:bg-gray-800/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">Dashboard</h1>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* 🔹 Profile Card */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 mb-8 hover:border-gray-700 transition">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-4xl font-bold text-black">
                {userData.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{userData.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-teal-400" />
                    <span className="text-teal-400 font-semibold capitalize">
                      {userData.role}
                    </span>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Email Verified</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Phone Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* 🔹 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Bookings */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-white mt-2">{userData.bookings}</p>
              </div>
              <Calendar className="w-12 h-12 text-teal-400/20" />
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Loyalty Points</p>
                <p className="text-3xl font-bold text-white mt-2">{userData.loyaltyPoints}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-400/20" />
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Wallet Balance</p>
                <p className="text-3xl font-bold text-white mt-2">₹{userData.walletBalance}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reviews</p>
                <p className="text-3xl font-bold text-white mt-2">{userData.reviews}</p>
              </div>
              <Star className="w-12 h-12 text-orange-400/20" />
            </div>
          </div>
        </div>

        {/* 🔹 Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <User className="w-6 h-6 text-teal-400" />
              <span>Contact Information</span>
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="text-gray-400 text-sm font-semibold">Email Address</label>
                <div className="mt-2 flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <Mail className="w-5 h-5 text-teal-400" />
                  <span className="text-white">{userData.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-400 text-sm font-semibold">Phone Number</label>
                <div className="mt-2 flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <Phone className="w-5 h-5 text-teal-400" />
                  <span className="text-white">{userData.phone}</span>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-gray-400 text-sm font-semibold">Account Type</label>
                <div className="mt-2 flex items-center space-x-3 p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
                  <Scissors className="w-5 h-5 text-teal-400" />
                  <span className="text-teal-300 capitalize font-semibold">{userData.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition">
            <h3 className="text-2xl font-bold text-white mb-6">Account Statistics</h3>

            <div className="space-y-6">
              {/* Join Date */}
              <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-semibold">{userData.joinDate}</span>
              </div>

              {/* Total Bookings */}
              <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">Total Bookings</span>
                <span className="text-teal-400 font-bold text-lg">{userData.bookings}</span>
              </div>

              {/* Loyalty Points */}
              <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">Loyalty Points</span>
                <span className="text-yellow-400 font-bold text-lg">{userData.loyaltyPoints}</span>
              </div>

              {/* Wallet Balance */}
              <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <span className="text-gray-400">Wallet Balance</span>
                <span className="text-green-400 font-bold text-lg">₹{userData.walletBalance}</span>
              </div>

              {/* Rating */}
              <div className="flex justify-between items-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <span className="text-gray-400">Your Rating</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "text-orange-400 fill-orange-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Action Buttons */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/my-booking">
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-3 rounded-lg transition transform hover:scale-105">
              View Bookings
            </Button>
          </Link>
          <Link href="/payment">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105">
              Manage Wallet
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            Sign Out
          </Button>
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