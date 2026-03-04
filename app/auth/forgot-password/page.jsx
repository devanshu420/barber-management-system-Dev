"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Mail } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://barber-book-devanshu.onrender.com/api/auth/forgot-password-otp",
        { email }
      );

      if (res.data.success) {
        setMessage("✅ OTP sent to your email.");
        // email ko reset flow ke liye store karo
        if (typeof window !== "undefined") {
          localStorage.setItem("resetEmail", email);
        }
        setTimeout(() => {
          router.push("/auth/reset-password");
        }, 800);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSendOtp}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 w-full max-w-md hover:border-gray-700/50 transition animate-fadeIn"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-full mb-3">
            <Scissors className="w-6 h-6 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Forgot Password
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your registered email to receive an OTP
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-gray-300 text-sm font-semibold block"
          >
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
            />
            <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-linear-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>

        {/* Message */}
        {message && (
          <div
            className={`mt-2 p-3 rounded-lg text-center text-sm font-medium transition ${
              message.startsWith("✅")
                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                : "bg-red-500/20 text-red-400 border border-red-500/40"
            }`}
          >
            {message}
          </div>
        )}

        {/* Back to login */}
        <div className="pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="text-teal-400 font-semibold hover:text-teal-300 transition"
            >
              Back to Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
