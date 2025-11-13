"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export function TimeSelection({ serviceDuration, onSelect, shop }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [workingHours, setWorkingHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch shop working hours and booked slots
  useEffect(() => {
    async function fetchShopData() {
      setLoading(true);
      setError("");

      try {
        if (!shop || !shop.id) {
          setError("Shop not selected");
          setLoading(false);
          return;
        }

        const shopId = shop._id || shop.id;

        // Get shop details including working hours
        const response = await axios.get(
          `http://localhost:5000/api/barbers/shops/${shopId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Shop data:", response.data);

        if (response.data.success) {
          const shopData = response.data.data;
          setWorkingHours(shopData.workingHours || {});

          // Fetch booked appointments for this shop
          try {
            const bookingsResponse = await axios.get(
              `http://localhost:5000/api/bookings/shop/${shopId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (bookingsResponse.data.success) {
              console.log("Bookings:", bookingsResponse.data.bookings);
            }
          } catch (bookingErr) {
            console.log("Could not fetch bookings:", bookingErr);
          }
        } else {
          setError("Failed to fetch shop details");
        }
      } catch (err) {
        console.error("Error fetching shop data:", err);
        setError("Unable to load shop information");
      } finally {
        setLoading(false);
      }
    }

    fetchShopData();
  }, [shop]);

  // 🔹 Generate time slots based on working hours
  const generateTimeSlots = (hoursData) => {
    const slots = [];

    if (!hoursData) return slots;

    // Example working hours format: { openTime: "09:00", closeTime: "18:00" }
    const openTime = hoursData.openTime || "09:00";
    const closeTime = hoursData.closeTime || "18:00";

    const [openHour, openMin] = openTime.split(":").map(Number);
    const [closeHour, closeMin] = closeTime.split(":").map(Number);

    let currentHour = openHour;
    let currentMin = openMin;

    while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
      const hour = currentHour.toString().padStart(2, "0");
      const min = currentMin.toString().padStart(2, "0");
      const timeStr = `${hour}:${min}`;

      // Convert to 12-hour format
      const timeDisplay = convertTo12Hour(timeStr);
      slots.push(timeDisplay);

      // Add 30 minutes interval
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    return slots;
  };


const generateEndTime = (startTime, duration) => {
  const [time, period] = startTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const start = new Date();
  start.setHours(hours, minutes);

  const end = new Date(start.getTime() + duration * 60000);

  const endHours = end.getHours() % 12 || 12;
  const endMinutes = end.getMinutes().toString().padStart(2, "0");
  const endPeriod = end.getHours() >= 12 ? "PM" : "AM";

  return `${endHours}:${endMinutes} ${endPeriod}`;
};



  // 🔹 Convert 24-hour to 12-hour format
  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // 🔹 Fetch booked slots for selected date
  useEffect(() => {
    async function fetchBookedSlotsForDate() {
      if (!selectedDate || !shop) return;

      try {
        const dateStr = selectedDate.toISOString().split("T")[0];

        // Call backend to get booked slots for this date
        const response = await axios.get(
          `http://localhost:5000/api/bookings/shop/${shop._id || shop.id}/date/${dateStr}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const booked = response.data.bookedSlots || [];
          setBookedSlots(booked);
        } else {
          setBookedSlots([]);
        }
      } catch (err) {
        console.log("No bookings found for this date");
        setBookedSlots([]);
      }

      setSelectedTime(null);
    }

    fetchBookedSlotsForDate();
  }, [selectedDate, shop]);

  // 🔹 Generate available slots when working hours change
  useEffect(() => {
    if (workingHours) {
      const slots = generateTimeSlots(workingHours);
      setAvailableSlots(slots);
    }
  }, [workingHours]);

  // 🔹 Check if time is booked
  const isBooked = (time) => bookedSlots.includes(time);

  // 🔹 Validate date is within working days
  const filterDate = (date) => {
    if (!workingHours || !workingHours.workingDays) return true;

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const workingDays = workingHours.workingDays || [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return workingDays.includes(dayName);
  };

 const handleConfirm = () => {
  if (selectedDate && selectedTime) {
    const endTime = generateEndTime(selectedTime, serviceDuration);

    onSelect(selectedDate, {
      startTime: selectedTime,
      endTime: endTime,
    });
  }
};


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading available time slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Select Date & Time
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
          Choose your preferred appointment time
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Working Hours Info */}
      {workingHours && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <p className="text-blue-300 font-semibold text-sm">Working Hours</p>
          </div>
          <p className="text-blue-200 text-sm">
            {workingHours.openTime || "09:00"} - {workingHours.closeTime || "18:00"}
          </p>
          {workingHours.workingDays && (
            <p className="text-blue-200 text-sm mt-2">
              Working Days: {workingHours.workingDays.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Date Picker */}
      <div>
        <label className="block text-white font-semibold mb-3 text-sm sm:text-base">
          Select Date
        </label>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            filterDate={filterDate}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2.5 focus:border-teal-500 outline-none"
            placeholderText="Click to select a date"
            dateFormat="MMMM d, yyyy"
            calendarClassName="bg-gray-900 text-white"
          />
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-white font-semibold text-sm sm:text-base">
              Select Time
            </label>
            <span className="text-gray-400 text-xs sm:text-sm">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {availableSlots.length === 0 ? (
            <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg text-center">
              <p className="text-gray-400 text-sm">
                No time slots available on this date
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSlots.map((time) => {
                const disabled = isBooked(time);
                const selected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => !disabled && setSelectedTime(time)}
                    disabled={disabled}
                    className={`p-3 rounded-lg text-center transition-all border-2 text-sm sm:text-base ${
                      selected
                        ? "border-teal-500 bg-teal-500/10 text-teal-400"
                        : disabled
                        ? "border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                        : "border-gray-700 bg-gray-800 hover:border-teal-500/50 text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          disabled ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <p
                      className={`font-semibold ${
                        selected
                          ? "text-teal-400"
                          : disabled
                          ? "text-gray-500 line-through"
                          : "text-white"
                      }`}
                    >
                      {time}
                    </p>
                    {disabled && (
                      <p className="text-xs text-gray-500 mt-1">Booked</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Select a date to view available times</p>
        </div>
      )}

      {/* Duration Info */}
      {serviceDuration && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-orange-300 text-sm">
            ⏱️ This service will take approximately{" "}
            <strong>{serviceDuration} minutes</strong>
          </p>
        </div>
      )}

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime}
        className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition transform hover:scale-105"
      >
        Continue to Confirmation
      </Button>
    </div>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Calendar, Clock } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Mock time slots with booked flags per date
// const mockBookedSlots = {
//   // key = ISO date string
//   "2025-11-05": ["10:00 AM", "3:00 PM"],
//   "2025-11-06": ["9:00 AM", "11:00 AM", "2:30 PM"],
//   // add more booked dates and times here
// };

// // List of all available time slots
// const allTimeSlots = [
//   "9:00 AM",
//   "9:30 AM",
//   "10:00 AM",
//   "10:30 AM",
//   "11:00 AM",
//   "2:00 PM",
//   "2:30 PM",
//   "3:00 PM",
//   "3:30 PM",
//   "4:00 PM",
// ];

// export function TimeSelection({ serviceDuration, onSelect }) {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [bookedSlots, setBookedSlots] = useState([]);

//   // Update booked slots when selectedDate changes
//   useEffect(() => {
//     if (selectedDate) {
//       const dateKey = selectedDate.toISOString().split("T")[0];
//       setBookedSlots(mockBookedSlots[dateKey] || []);
//       setSelectedTime(null);
//     }
//   }, [selectedDate]);

//   const isBooked = (time) => bookedSlots.includes(time);

//   const handleConfirm = () => {
//     if (selectedDate && selectedTime) {
//       onSelect(selectedDate, selectedTime);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
//           <Calendar className="w-8 h-8 text-green-400" />
//         </div>
//         <h3 className="text-2xl font-bold text-white mb-2">Select Date & Time</h3>
//         <p className="text-gray-400">Choose your preferred appointment time</p>
//       </div>

//       {/* Date Picker */}
//       <div>
//         <label className="block text-white font-semibold mb-3">Select Date</label>
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           minDate={new Date()}
//           className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2"
//           placeholderText="Click to select a date"
//           dateFormat="MMMM d, yyyy"
//           calendarClassName="bg-gray-900 text-white"
//         />
//       </div>

//       {/* Time Slots */}
//       {selectedDate && (
//         <div>
//           <label className="block text-white font-semibold mb-3">Select Time</label>
//           <div className="grid grid-cols-3 gap-3">
//             {allTimeSlots.map((time) => {
//               const disabled = isBooked(time);
//               const selected = selectedTime === time;
//               return (
//                 <button
//                   key={time}
//                   onClick={() => !disabled && setSelectedTime(time)}
//                   disabled={disabled}
//                   className={`p-3 rounded-lg text-center transition-all border-2 ${
//                     selected
//                       ? "border-teal-500 bg-teal-500/10 text-teal-400"
//                       : disabled
//                       ? "border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed line-through"
//                       : "border-gray-700 bg-gray-800 hover:border-teal-500/50 text-white"
//                   }`}
//                 >
//                   <div className="flex items-center justify-center space-x-1 mb-1">
//                     <Clock className={`w-4 h-4 ${disabled ? 'text-gray-500' : 'text-gray-400'}`} />
//                   </div>
//                   <p className={`font-semibold ${selected ? "text-teal-400" : disabled ? "text-gray-500" : "text-white"}`}>
//                     {time}
//                   </p>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Duration Info */}
//       {serviceDuration && (
//         <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
//           <p className="text-blue-300 text-sm">
//             ℹ️ This service will take approximately <strong>{serviceDuration} minutes</strong>
//           </p>
//         </div>
//       )}

//       <Button
//         onClick={handleConfirm}
//         disabled={!selectedDate || !selectedTime}
//         className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-black font-semibold rounded-lg"
//       >
//         Continue to Confirmation
//       </Button>
//     </div>
//   );
// }
