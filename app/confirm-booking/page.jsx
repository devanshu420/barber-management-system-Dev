"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Calendar, Clock, User } from "lucide-react";

const ConfirmBookingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 text-gray-900 transform transition-all duration-500 hover:scale-[1.02] animate-fadeIn">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <CheckCircle className="w-16 h-16 text-teal-400 mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold mb-2 text-center">Booking Confirmed!</h1>
          <p className="text-gray-600 text-center">
            Your appointment has been successfully scheduled.
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4 hover:bg-teal-50 transition transform hover:scale-[1.02]">
            <User className="w-6 h-6 text-teal-400" />
            {/* <span>Barber ID: <span className="font-semibold">{barberId}</span></span> */}
            <span>Barber ID: <span className="font-semibold">Indian Barber</span></span>

          </div>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4 hover:bg-yellow-50 transition transform hover:scale-[1.02]">
            <Calendar className="w-6 h-6 text-yellow-400" />
            <span>Date: <span className="font-semibold">{date}</span></span>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4 hover:bg-pink-50 transition transform hover:scale-[1.02]">
            <Clock className="w-6 h-6 text-pink-400" />
            <span>Time: <span className="font-semibold">{time}</span></span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/my-bookings")}
          className="w-full py-3 bg-teal-400 hover:bg-teal-500 rounded-lg font-semibold text-lg text-white transition transform hover:scale-105"
        >
          View My Bookings
        </button>

        {/* Footer Note */}
        <p className="text-gray-500 text-sm text-center mt-4">
          You will also receive a confirmation email shortly.
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-bounce {
          animation: bounce 1s infinite alternate;
        }

        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}


export default ConfirmBookingPage;