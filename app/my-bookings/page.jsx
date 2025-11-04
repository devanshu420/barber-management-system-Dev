"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Clock, User, Scissors, X } from "lucide-react";

// Example bookings data
const bookings = [
  {
    id: 1,
    barber: "Devanshu Sharma",
    date: "2024-06-15",
    time: "10:00 AM",
    service: "Haircut",
    status: "Confirmed",
  },
  {
    id: 2,
    barber: "Vinayak Singh",
    date: "2024-06-18",
    time: "2:30 PM",
    service: "Shave",
    status: "Pending",
  },
];

export default function MyBookingsPage() {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  const handleCancel = (id) => {
    alert(`Booking #${id} cancelled!`);
    handleCloseDetails();
  };

  const handleReschedule = (id) => {
    alert(`Booking #${id} reschedule requested!`);
    handleCloseDetails();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <button
          className="mb-8 px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-full font-semibold transition shadow-md"
          onClick={() => router.push("/services")}
        >
          &#8592; Back to Services
        </button>

        {/* Page Title */}
        <h1 className="text-5xl font-extrabold mb-12 text-center text-teal-400 drop-shadow-lg">
          My Bookings
        </h1>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-center text-lg mt-10">
            You have no bookings yet.
          </p>
        ) : (
          <ul className="space-y-8">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Booking Info */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="p-4 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Scissors className="w-7 h-7 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{booking.service}</h3>
                    <div className="text-gray-400 text-sm flex flex-wrap gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {booking.barber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-4 md:mt-0">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-bold ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <button
                    className="px-4 py-1 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm transition shadow"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View Details
                  </button>
                  <button
                    className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition shadow"
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm transition shadow"
                    onClick={() => handleReschedule(booking.id)}
                  >
                    Reschedule
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Booking Details Modal */}
        {showDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
                onClick={handleCloseDetails}
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold mb-6 text-teal-400 text-center">
                Booking Details
              </h2>
              <div className="space-y-2 text-gray-200 text-lg">
                <p><strong>Service:</strong> {selectedBooking.service}</p>
                <p><strong>Barber:</strong> {selectedBooking.barber}</p>
                <p><strong>Date:</strong> {selectedBooking.date}</p>
                <p><strong>Time:</strong> {selectedBooking.time}</p>
                <p><strong>Status:</strong> {selectedBooking.status}</p>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
                  onClick={() => handleCancel(selectedBooking.id)}
                >
                  Cancel Booking
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow"
                  onClick={() => handleReschedule(selectedBooking.id)}
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
