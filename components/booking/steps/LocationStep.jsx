"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Search, AlertCircle } from "lucide-react";

export function LocationSelection({ onSelect }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  //  Get current location via GPS
  const handleGPSLocation = async () => {
    setLoading(true);
    setError("");

    try {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
         onSelect({
  latitude,
  longitude,
  address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
  city: "",  // to avoid undefined
});

          setLoading(false);
        },
        (err) => {
          setError("Unable to access location. Please enable location permissions.");
          setLoading(false);
          setShowManualInput(true);
        }
      );
    } catch (err) {
      setError("Failed to get location");
      setLoading(false);
    }
  };

  // 🔹 Handle manual location input
  const handleManualLocation = () => {
    if (!manualLocation.trim()) {
      setError("Please enter a valid location");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate location processing
    setTimeout(() => {
      const simulatedLocation = {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.006 + (Math.random() - 0.5) * 0.1,
        address: manualLocation.trim(),
        city:manualLocation.trim().toLowerCase()
      };
      onSelect(simulatedLocation);
      setLoading(false);
      setManualLocation("");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Enter Your Location</h3>
        <p className="text-gray-400 text-sm sm:text-base">
          We need your location to find nearby barbershops
        </p>
      </div>

      {/* 🔹 GPS Option */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-lg mb-4">
            <Navigation className="w-7 h-7 text-blue-400" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Use Current Location</h4>
          <p className="text-gray-400 text-sm mb-6">
            Allow location access to automatically find nearby barbershops
          </p>
          <Button
            onClick={handleGPSLocation}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {loading ? "Getting Location..." : "Use GPS Location"}
          </Button>
        </div>
      </div>

      {/* 🔹 Divider */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-800 to-transparent"></div>
        <span className="text-gray-500 text-xs font-semibold uppercase">OR</span>
        <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-800 to-transparent"></div>
      </div>

      {/* 🔹 Manual Location Option */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-500/20 rounded-lg mb-4">
            <Search className="w-7 h-7 text-teal-400" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">Enter Location Manually</h4>
          <p className="text-gray-400 text-sm">
            Type your address or city name
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          {/* Input Field */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-300 font-semibold">
              Your Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter your address, city, or zip code"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleManualLocation()}
              className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50 focus:bg-gray-800/80 transition rounded-lg py-2.5"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleManualLocation}
            disabled={loading || !manualLocation.trim()}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-2.5 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Finding Location..." : "Find Barbershops"}
          </Button>
        </div>
      </div>

      {/* 🔹 Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* 🔹 Privacy Notice */}
      <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
        <p className="text-center text-gray-400 text-xs sm:text-sm">
          🔒 Your location will only be used to find nearby barbershops and will not be stored
        </p>
      </div>
    </div>
  );
}

