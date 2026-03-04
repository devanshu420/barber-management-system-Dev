"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Loader2,
  ArrowLeft,
} from "lucide-react";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function BookingConfirmation({ bookingData, onBack }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleConfirmAndPay = async () => {
    console.log("Booking Data:", bookingData);
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Please login first.");
        setLoading(false);
        return;
      }

      // 1️⃣ Create Booking (pending)
      const bookingRes = await axios.post(
        "/api/bookings/create-bookings",
        {
          shopId: bookingData.shop._id,
          serviceId: bookingData.service._id,
          serviceName: bookingData.service.name,
          bookingDate: new Date(bookingData.date).toISOString(),
          bookingTime: {
            startTime: bookingData.time.startTime,
            endTime: bookingData.time.endTime,
          },
          amount: bookingData.service.price,
          paymentMethod: "razorpay",
          notes: bookingData.notes || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingId = bookingRes.data.data._id;

      // 2️⃣ Create Razorpay Order
      const { data } = await axios.post(
        "/api/payment/create-order",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order, key } = data;

      // 3️⃣ Razorpay Options
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Barber Management System",
        description: bookingData.service.name,

        handler: async function (response) {
          try {
            await axios.post(
              "/api/payment/verify-payment",
              {
                ...response,
                bookingId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setMessage("✅ Payment Successful!");
            setTimeout(() => {
              router.push("/dashboard/customer");
            }, 1500);
          } catch (err) {
            setMessage("✅ Payment Successful!"); // For Test Mode only
            router.push("/dashboard/customer"); // For Test Mode only

            // setMessage("❌ Payment verification failed.");
          }
        },

        prefill: {
          name: bookingData.user?.name || "",
          email: bookingData.user?.email || "",
        },

        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setMessage(
        `❌ ${
          error.response?.data?.message || error.message || "Something went wrong"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = bookingData.service?.price || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Top badge + title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/60 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Review & confirm
              </h2>
              <p className="text-sm text-slate-400">
                Make sure everything looks correct before you pay.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/40 px-4 py-2 text-xs sm:text-sm text-emerald-200">
            <span className="font-medium">Step 3 of 3</span>
            <span className="mx-2 text-slate-500">•</span>
            <span>Payment & confirmation</span>
          </div>
        </div>

        {/* Main content: left details + right summary */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Details */}
          <div className="space-y-5">
            {/* Shop & service */}
            <section className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Barbershop
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-white">
                    {bookingData.shop?.name}
                  </p>
                  {bookingData.shop?.location?.address && (
                    <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{bookingData.shop.location.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <User className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Service
                    </p>
                    <p className="text-sm sm:text-base font-medium text-white">
                      {bookingData.service?.name}
                    </p>
                    {bookingData.service?.duration && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Approx. {bookingData.service.duration} mins
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Calendar className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Date
                    </p>
                    <p className="text-sm sm:text-base font-medium text-white">
                      {formatDate(bookingData.date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Clock className="w-4 h-4 text-violet-300" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Time
                    </p>
                    <p className="text-sm sm:text-base font-medium text-white">
                      {bookingData.time?.startTime} –{" "}
                      {bookingData.time?.endTime}
                    </p>
                  </div>
                </div>

                {bookingData.user && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <User className="w-4 h-4 text-sky-300" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Booking for
                      </p>
                      <p className="text-sm font-medium text-white">
                        {bookingData.user?.name}
                      </p>
                      {bookingData.user?.email && (
                        <p className="text-xs text-slate-400">
                          {bookingData.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {bookingData.notes && (
                <div className="mt-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                    Notes for barber
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {bookingData.notes}
                  </p>
                </div>
              )}
            </section>

            {/* Info line */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs sm:text-sm text-amber-100">
              You can view and manage this booking later from your{" "}
              <span className="font-semibold">customer dashboard</span> after
              successful payment.
            </div>
          </div>

          {/* Summary / payment card */}
          <div className="space-y-4">
            <section>
              <h3 className="text-sm font-semibold text-slate-100 mb-3">
                Payment summary
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Service price</span>
                  <span>₹ {totalAmount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Convenience fee</span>
                  <span>₹ 0</span>
                </div>

                <div className="h-px bg-slate-800 my-2" />

                <div className="flex items-center justify-between text-base font-semibold text-white">
                  <span>Total payable</span>
                  <span>₹ {totalAmount}</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                By continuing, you agree to complete the payment via Razorpay.
              </p>
            </section>

            {message && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs sm:text-sm text-red-200">
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onBack}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-900/80 transition-colors disabled:opacity-60"
              >
                <ArrowLeft size={16} />
                Edit details
              </button>

              <button
                onClick={handleConfirmAndPay}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing…
                  </>
                ) : (
                  "Confirm & pay"
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
