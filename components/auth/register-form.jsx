"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Scissors } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters!");
      return;
    }

    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://barber-book-devanshu.onrender.com/api/auth/register",
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setMessage("✅ Account created successfully!");

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("userRole", formData.role);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userPhone", formData.phone);

        setTimeout(() => {
          if (formData.role === "barber") {
            router.push("/barber-shop-registration");
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        setMessage(`❌ ${response.data.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        setMessage(`❌ ${error.response.data.message || "Registration failed"}`);
      } else if (error.request) {
        setMessage(
          "❌ No response from server. Check if backend is running on https://barber-book-devanshu.onrender.com"
        );  
      } else {
        setMessage(`❌ ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-10">
      <form
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-b from-gray-900/85 via-gray-900/95 to-black/95 backdrop-blur-2xl border border-gray-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.75)] rounded-3xl px-6 sm:px-7 py-7 space-y-5 hover:border-gray-700/60 transition-all duration-200 hover:-translate-y-0.5"
      >
        {/* top glow line */}
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />

        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_0_22px_rgba(20,184,166,0.5)]">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl sm:text-2xl text-white">
              BarberBook
            </span>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Create your account
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Join the{" "}
              <span className="text-teal-400 font-medium">
                {formData.role === "customer" ? "grooming" : "barber"}
              </span>{" "}
              community in minutes.
            </p>
          </div>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-gray-900/80 rounded-2xl border border-gray-800/90">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "customer" })}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              formData.role === "customer"
                ? "bg-teal-500 text-black shadow-[0_0_18px_rgba(20,184,166,0.7)]"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "barber" })}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              formData.role === "barber"
                ? "bg-teal-500 text-black shadow-[0_0_18px_rgba(20,184,166,0.7)]"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Barber</span>
          </button>
        </div>

        {/* Role Description */}
        <div className="p-3.5 bg-gradient-to-r from-teal-500/12 to-teal-600/10 border border-teal-500/30 rounded-2xl">
          <p className="text-teal-300 text-xs sm:text-sm font-medium text-center">
            {formData.role === "customer"
              ? "📍 Discover and book appointments with trusted barbers near you."
              : "💼 Showcase your services, manage clients, and grow your shop."}
          </p>
        </div>

        {/* Name fields side-by-side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* First Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="firstName"
              className="text-gray-300 text-xs sm:text-sm font-medium"
            >
              First name
            </Label>
            <Input
              id="firstName"
              placeholder="Devanshu"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2.5 w-full focus:border-teal-500/60 focus:bg-gray-900 transition"
              required
            />
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="lastName"
              className="text-gray-300 text-xs sm:text-sm font-medium"
            >
              Last name
            </Label>
            <Input
              id="lastName"
              placeholder="Sharma"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2.5 w-full focus:border-teal-500/60 focus:bg-gray-900 transition"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-gray-300 text-xs sm:text-sm font-medium"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2.5 w-full focus:border-teal-500/60 focus:bg-gray-900 transition"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label
            htmlFor="phone"
            className="text-gray-300 text-xs sm:text-sm font-medium"
          >
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2.5 w-full focus:border-teal-500/60 focus:bg-gray-900 transition"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-gray-300 text-xs sm:text-sm font-medium"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2.5 pr-10 w-full focus:border-teal-500/60 focus:bg-gray-900 transition"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gray-500 hover:text-teal-400 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-gray-300 text-xs sm:text-sm font-medium"
          >
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2.5 pr-10 w-full focus:border-teal-500/60 focus:bg-gray-900 transition"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gray-500 hover:text-teal-400 transition"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-teal-500 via-teal-500 to-emerald-500 hover:from-teal-400 hover:via-teal-500 hover:to-emerald-400 text-black font-semibold rounded-2xl transition-transform duration-150 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base shadow-[0_12px_32px_rgba(20,184,166,0.6)]"
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-3.5 rounded-xl text-center text-xs sm:text-sm font-medium transition border ${
              message.startsWith("✅")
                ? "bg-emerald-500/12 text-emerald-400 border-emerald-500/50"
                : "bg-red-500/12 text-red-400 border-red-500/50"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
