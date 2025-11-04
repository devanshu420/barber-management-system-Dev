"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Mock time slots with booked flags per date
const mockBookedSlots = {
  // key = ISO date string
  "2025-11-05": ["10:00 AM", "3:00 PM"],
  "2025-11-06": ["9:00 AM", "11:00 AM", "2:30 PM"],
  // add more booked dates and times here
};

// List of all available time slots
const allTimeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
];

export function TimeSelection({ serviceDuration, onSelect }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Update booked slots when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split("T")[0];
      setBookedSlots(mockBookedSlots[dateKey] || []);
      setSelectedTime(null);
    }
  }, [selectedDate]);

  const isBooked = (time) => bookedSlots.includes(time);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Select Date & Time</h3>
        <p className="text-gray-400">Choose your preferred appointment time</p>
      </div>

      {/* Date Picker */}
      <div>
        <label className="block text-white font-semibold mb-3">Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={new Date()}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2"
          placeholderText="Click to select a date"
          dateFormat="MMMM d, yyyy"
          calendarClassName="bg-gray-900 text-white"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-white font-semibold mb-3">Select Time</label>
          <div className="grid grid-cols-3 gap-3">
            {allTimeSlots.map((time) => {
              const disabled = isBooked(time);
              const selected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => !disabled && setSelectedTime(time)}
                  disabled={disabled}
                  className={`p-3 rounded-lg text-center transition-all border-2 ${
                    selected
                      ? "border-teal-500 bg-teal-500/10 text-teal-400"
                      : disabled
                      ? "border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed line-through"
                      : "border-gray-700 bg-gray-800 hover:border-teal-500/50 text-white"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Clock className={`w-4 h-4 ${disabled ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`font-semibold ${selected ? "text-teal-400" : disabled ? "text-gray-500" : "text-white"}`}>
                    {time}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Duration Info */}
      {serviceDuration && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            ℹ️ This service will take approximately <strong>{serviceDuration} minutes</strong>
          </p>
        </div>
      )}

      <Button
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime}
        className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-black font-semibold rounded-lg"
      >
        Continue to Confirmation
      </Button>
    </div>
  );
}
