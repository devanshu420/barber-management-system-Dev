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
        "http://localhost:5000/api/auth/register",
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setMessage("✅ Account created successfully!");

        // Store user info in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("userRole", formData.role);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userPhone", formData.phone);

        // Redirect based on role
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
        setMessage("❌ No response from server. Check if backend is running on http://localhost:5000");
      } else {
        setMessage(`❌ ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl p-8 space-y-5 hover:border-gray-700/50 transition"
      >
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">BarberBook</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">
            Get started in just a few minutes
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "customer" })}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md font-semibold transition duration-300 text-sm ${
              formData.role === "customer"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-black shadow-lg"
                : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "barber" })}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md font-semibold transition duration-300 text-sm ${
              formData.role === "barber"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-black shadow-lg"
                : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Barber</span>
          </button>
        </div>

        {/* Role Description */}
        <div className="p-3 bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-lg">
          <p className="text-teal-300 text-sm font-medium text-center">
            {formData.role === "customer"
              ? "📍 Book appointments with professional barbers"
              : "💼 Manage services and grow your business"}
          </p>
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-300 text-sm font-semibold block">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="Devanshu"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
            required
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-300 text-sm font-semibold block">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Sharma"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 text-sm font-semibold block">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="prestige@education.in"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300 text-sm font-semibold block">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 987654321"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300 text-sm font-semibold block">
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
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-teal-400 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-semibold block">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-teal-400 transition"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-4 rounded-lg text-center text-sm font-medium transition ${
              message.startsWith("✅")
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
          >
            {message}
          </div>
        )}
      </form>

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
