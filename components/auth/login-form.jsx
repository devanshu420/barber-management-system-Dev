"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Scissors,
  Mail,
  Lock,
  User2,
  Sparkles,
} from "lucide-react";

export function LoginForm({ role = "customer" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState(role);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await axios.post(
        "https://barber-book-devanshu.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        const userFromDB = response.data.user;
        const actualRole =
          userFromDB.role || userFromDB.userType || "customer";

        // yaha selectedRole use ho raha hai
        if (actualRole !== selectedRole) {
          setMessage(
            `❌ Role mismatch! You are registered as "${actualRole}" but trying to login as "${selectedRole}". Please select the correct role.`
          );
          setLoading(false);
          return;
        }

        setMessage("✅ Login successful!");

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", userFromDB.name);
        localStorage.setItem("userEmail", userFromDB.email);
        localStorage.setItem("userRole", actualRole);
        localStorage.setItem("userId", userFromDB._id || userFromDB.id);

        setTimeout(() => {
          if (actualRole === "barber") {
            router.push("/barber-shop");
          } else if (actualRole === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        }, 1200);
      } else {
        setMessage(`❌ ${response.data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setMessage("❌ User does not exist.");
        } else if (error.response.status === 401) {
          setMessage("❌ Incorrect password.");
        } else {
          setMessage(`❌ ${error.response.data.message || "Login failed."}`);
        }
      } else {
        setMessage("❌ Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Background glow (compact) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-10 h-56 w-56 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-black/90 backdrop-blur-2xl border border-gray-800/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)] rounded-3xl px-6 py-5 space-y-5 w-full max-w-md hover:border-gray-700/70 transition-all duration-200 hover:-translate-y-0.5"
      >
        {/* Top accent line */}
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />

        {/* Header */}
        <div className="text-center mb-1 space-y-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-teal-500/15 border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <Scissors className="w-6 h-6 text-teal-400" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white flex items-center justify-center gap-1.5">
              Welcome back
              <Sparkles className="w-4 h-4 text-teal-400" />
            </h2>
            <p className="text-gray-400 text-[11px] sm:text-xs">
              Sign in to manage your{" "}
              <span className="text-teal-400/90 font-medium">
                {selectedRole === "barber" ? "barber profile" : "bookings"}
              </span>
            </p>
          </div>
        </div>

        {/* Role tabs */}
        <div className="flex gap-2 bg-gray-900/70 p-1.5 rounded-2xl border border-gray-800">
          <button
            type="button"
            onClick={() => setSelectedRole("customer")}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              selectedRole === "customer"
                ? "bg-teal-500 text-black shadow-[0_0_14px_rgba(20,184,166,0.6)]"
                : "bg-transparent text-gray-400 hover:text-white"
            }`}
          >
            <User2 className="w-3.5 h-3.5" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("barber")}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              selectedRole === "barber"
                ? "bg-teal-500 text-black shadow-[0_0_14px_rgba(20,184,166,0.6)]"
                : "bg-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            Barber
          </button>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-gray-300 text-xs font-medium flex items-center gap-1"
          >
            Email address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2 pr-9 w-full focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/50 focus:bg-gray-900 transition"
              required
            />
            <Mail className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] sm:text-xs">
            <Label
              htmlFor="password"
              className="text-gray-300 font-medium flex items-center gap-1"
            >
              Password
            </Label>
            <span className="text-gray-500">Min 6 characters</span>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-gray-900/70 border-gray-800 text-white placeholder:text-gray-600 text-xs sm:text-sm py-2 pr-10 w-full focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/50 focus:bg-gray-900 transition"
              required
            />
            <Lock className="w-4 h-4 text-gray-500 absolute right-8 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-gray-500 hover:text-teal-400 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-teal-500 via-teal-500 to-emerald-500 hover:from-teal-400 hover:via-teal-500 hover:to-emerald-400 text-black font-semibold rounded-2xl transition-transform duration-150 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-[0_10px_24px_rgba(20,184,166,0.5)]"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        {/* Message */}
        {message && (
          <div
            className={`p-2.5 rounded-xl text-center text-xs sm:text-sm font-medium transition border ${
              message.startsWith("✅")
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                : "bg-red-500/10 text-red-400 border-red-500/40"
            }`}
          >
            {message}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-gray-800/80 text-center space-y-1.5">
          <p className="text-gray-400 text-xs sm:text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/register"
              className="text-teal-400 font-semibold hover:text-teal-300 transition"
            >
              Create an account
            </a>
          </p>

          <a
            href="/auth/forgot-password"
            className="inline-block text-xs sm:text-sm text-teal-400 hover:text-teal-300 transition"
          >
            Forgot password?
          </a>
        </div>

        <div className="pt-1 text-center">
          <p className="text-gray-500 text-[11px] sm:text-xs">
            Logging in as{" "}
            <span className="text-teal-400 font-semibold capitalize">
              {selectedRole}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
