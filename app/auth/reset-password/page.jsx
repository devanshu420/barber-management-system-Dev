"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  Clock as ClockIcon,
  Scissors,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("resetEmail")
      : null;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("otp"); // "otp" | "password"
  const [toast, setToast] = useState(null); // { type, message }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputsRef = useRef([]);

  // Countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Step 1: verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const finalOtp = otp.join("");

      console.log("email sending =>", email);
      console.log("otp sending   =>", finalOtp, "length:", finalOtp.length);

      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-reset-otp",
        {
          email,
          otp: finalOtp,
        }
      );

      console.log("verify response =>", res.data);

      if (res.data.success) {
        showToast("OTP verified, please set a new password", "success");
        setStep("password");
      } else {
        showToast(res.data.message || "Invalid OTP", "error");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "OTP verification failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: set new password
  const handleSetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showToast("Please fill both password fields", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);
      const finalOtp = otp.join(""); // if backend still expects OTP

      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password-otp",
        {
          email,
          otp: finalOtp,
          newPassword,
        }
      );

      if (res.data.success) {
        showToast("Password updated successfully, redirecting…", "success");

        if (typeof window !== "undefined") {
          localStorage.removeItem("resetEmail");
        }

        setTimeout(() => {
          router.push("/auth/login");
        }, 1800);
      } else {
        showToast(res.data.message || "Reset failed", "error");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Reset failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/forgot-password-otp",
        { email }
      );
      setTimer(60);
      showToast("OTP resent successfully", "success");
    } catch {
      showToast("Failed to resend OTP", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center px-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <form
        onSubmit={step === "otp" ? handleVerifyOtp : handleSetPassword}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 w-full max-w-md hover:border-gray-700/50 transition animate-fadeIn"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-full mb-3">
            <Scissors className="w-6 h-6 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {step === "otp" ? "Verify OTP" : "Set New Password"}
          </h2>
          <p className="text-gray-400 text-sm">
            {step === "otp" ? (
              <>
                Enter the OTP sent to{" "}
                <span className="text-teal-400 font-medium">
                  {email || "your email"}
                </span>
              </>
            ) : (
              "Create a strong password for your account"
            )}
          </p>
        </div>

        {/* Step 1: OTP */}
        {step === "otp" && (
          <>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm font-semibold">
                Verification Code
              </p>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, index)
                    }
                    ref={(el) => (inputsRef.current[index] = el)}
                    className="text-center bg-gray-800/60 border-gray-700 text-white text-lg h-12 w-10 sm:h-12 sm:w-12 focus:border-teal-500/70 focus:bg-gray-800"
                  />
                ))}
              </div>
            </div>

            {/* Timer / Resend */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <ClockIcon className="w-4 h-4 text-teal-400" />
              {timer > 0 ? (
                <p>Resend OTP in {timer}s</p>
              ) : (
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-teal-400 hover:text-teal-300 font-semibold"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}

        {/* Step 2: Password + Confirm */}
        {step === "password" && (
          <div className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <p className="text-gray-300 text-sm font-semibold">
                New Password
              </p>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute right-9 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-400"
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
            <div className="space-y-2">
              <p className="text-gray-300 text-sm font-semibold">
                Confirm Password
              </p>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 text-sm py-2.5 pr-10 w-full focus:border-teal-500/50 focus:bg-gray-800/80 transition"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute right-9 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-400"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-linear-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
        >
          {loading
            ? step === "otp"
              ? "Verifying..."
              : "Updating..."
            : step === "otp"
            ? "Verify OTP"
            : "Update Password"}
        </Button>

        {/* Back link */}
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
