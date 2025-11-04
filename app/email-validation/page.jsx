"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

// Setup Axios with Base URL
const api = axios.create({
  baseURL: "http://localhost:5000",
});

const sendOtpApi = async (email, phone, type) => {
  return await api.post("/api/auth/send-otp", { email, phone, type });
};
const verifyOtpApi = async (userId, otp) => {
  return await api.post("/api/auth/verify-otp", { userId, otp });
};

export default function OtpValidation({ onVerifySuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please fill all 6 digits");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Pass userId from your auth flow or state
      const userId = "YOUR_USER_ID_HERE";
      const res = await verifyOtpApi(userId, enteredOtp);
      if (res.data.success) {
        setMessage("OTP Verified successfully!");
        onVerifySuccess();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">
      <div className="max-w-md w-full p-8 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl text-white">
        <h2 className="text-3xl font-semibold mb-4 text-center">Enter OTP</h2>
        <div className="flex justify-center space-x-4 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-14 h-14 text-center rounded-xl bg-gray-800 border border-teal-600 focus:border-teal-400 focus:outline-none text-2xl font-mono tracking-widest transition"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        <Button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-black font-semibold rounded-lg transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
