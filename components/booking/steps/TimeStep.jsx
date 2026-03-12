"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export function TimeSelection({ serviceDuration, onSelect, shop }) {
  // console.log("Service Duration:", serviceDuration);
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

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/barbers/shops/${shopId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        console.log("Shop data:", response.data);

        if (response.data.success) {
          const shopData = response.data.data;
          setWorkingHours(shopData.workingHours || {});

          // Fetch booked appointments for this shop (kept as in your logic)
          try {
            const bookingsResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/shop/${shopId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
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

    const openTime = hoursData.openTime || "09:00";
    const closeTime = hoursData.closeTime || "18:00";

    const [openHour, openMin] = openTime.split(":").map(Number);
    const [closeHour, closeMin] = closeTime.split(":").map(Number);

    let currentHour = openHour;
    let currentMin = openMin;

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMin < closeMin)
    ) {
      const hour = currentHour.toString().padStart(2, "0");
      const min = currentMin.toString().padStart(2, "0");
      const timeStr = `${hour}:${min}`;

      const timeDisplay = convertTo12Hour(timeStr);
      slots.push(timeDisplay);

      currentMin += serviceDuration || 30;
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    return slots;
  };

  const generateEndTime = (startTime, duration = 30) => {
    if (!startTime) return "";

    const [time, period] = startTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const start = new Date();
    start.setHours(hours);
    start.setMinutes(minutes);
    start.setSeconds(0);

    const end = new Date(start.getTime() + duration * 60000);

    let endHours = end.getHours();
    const endMinutes = end.getMinutes().toString().padStart(2, "0");

    const endPeriod = endHours >= 12 ? "PM" : "AM";
    endHours = endHours % 12 || 12;

    return `${endHours}:${endMinutes} ${endPeriod}`;
  };

  // 🔹 Convert 24-hour to 12-hour format
  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  // 🔹 Fetch booked slots for selected date
  useEffect(() => {
    async function fetchBookedSlotsForDate() {
      if (!selectedDate || !shop) return;

      try {
        const dateStr = selectedDate.toISOString().split("T")[0];

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/shop/${
            shop._id || shop.id
          }/date/${dateStr}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
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
      const duration = serviceDuration || 30;
      const endTime = generateEndTime(selectedTime, duration);

      onSelect(selectedDate, {
        startTime: selectedTime,
        endTime: endTime,
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-emerald-400 animate-spin" />
          <p className="text-gray-300 text-sm sm:text-base">
            Loading available time slots...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 sm:space-y-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500/25 to-teal-500/25 rounded-2xl mb-4 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
          <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-200" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Select date & time
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
          Choose when you’d like your appointment to start.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Working Hours Info */}
      {workingHours && (
        <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-4 h-4 text-sky-300" />
            <p className="text-sky-200 font-semibold text-xs sm:text-sm">
              Working hours
            </p>
          </div>
          <p className="text-sky-100 text-xs sm:text-sm">
            {workingHours.openTime || "09:00"} –{" "}
            {workingHours.closeTime || "18:00"}
          </p>
          {workingHours.workingDays && (
            <p className="text-sky-100 text-[11px] sm:text-xs mt-1.5">
              Days: {workingHours.workingDays.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Date Picker */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
          Select date
        </label>
        <div className="bg-gray-900/70 p-3.5 sm:p-4 rounded-2xl border border-gray-800/80">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            filterDate={filterDate}
            className="w-full rounded-xl border border-gray-800 bg-gray-950 text-white text-sm sm:text-base px-3 py-2.5 focus:border-teal-500 focus:outline-none"
            placeholderText="Click to pick a date"
            dateFormat="MMMM d, yyyy"
            calendarClassName="bg-gray-900 text-white rounded-xl overflow-hidden border border-gray-800"
          />
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate ? (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-white font-semibold text-sm sm:text-base">
              Select time
            </label>
            <span className="text-gray-400 text-[11px] sm:text-xs">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {availableSlots.length === 0 ? (
            <div className="p-4 bg-gray-900/70 border border-gray-800/80 rounded-xl text-center">
              <p className="text-gray-300 text-sm">
                No time slots available on this date.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {availableSlots.map((time) => {
                const disabled = isBooked(time);
                const selected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => !disabled && setSelectedTime(time)}
                    disabled={disabled}
                    className={`p-2.5 sm:p-3 rounded-xl text-center transition-all border text-xs sm:text-sm ${
                      selected
                        ? "border-teal-500 bg-teal-500/15 text-teal-300 shadow-[0_0_18px_rgba(45,212,191,0.5)]"
                        : disabled
                          ? "border-gray-700 bg-gray-800/70 text-gray-500 cursor-not-allowed opacity-60"
                          : "border-gray-800 bg-gray-900/80 hover:border-teal-500/60 hover:bg-gray-900 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          disabled ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <p
                      className={`font-semibold ${
                        selected
                          ? "text-teal-300"
                          : disabled
                            ? "text-gray-500 line-through"
                            : "text-white"
                      }`}
                    >
                      {time}
                    </p>
                    {disabled && (
                      <p className="text-[10px] text-gray-500 mt-1">Booked</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-gray-900/70 border border-gray-800/80 rounded-xl text-center">
          <p className="text-gray-300 text-sm">
            Select a date to see available time slots.
          </p>
        </div>
      )}

      {/* Duration Info */}
      {serviceDuration && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-amber-200 text-xs sm:text-sm">
            ⏱ This service takes approximately{" "}
            <span className="font-semibold">{serviceDuration} minutes</span>.
          </p>
        </div>
      )}

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime}
        className="w-full py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-2xl transition-transform duration-150 hover:scale-[1.02]"
      >
        Continue to confirmation
      </Button>
    </div>
  );
}
