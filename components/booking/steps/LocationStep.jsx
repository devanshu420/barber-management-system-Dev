


"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Search, AlertCircle, Loader } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export function LocationSelection({ onSelect }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [nearbyShops, setNearbyShops] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState(5);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [searchType, setSearchType] = useState(null); // "gps" or "city"

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // GPS API: /api/barbers/nearby-shops?latitude=...&longitude=...
  const fetchNearbyShopsByGPS = async (latitude, longitude, distance = 5) => {
    setShopsLoading(true);
    setError("");
    setSearchType("gps");

    try {
      const url = `http://localhost:5000/api/barbers/nearby-shops?latitude=${latitude}&longitude=${longitude}&maxDistance=${distance}&limit=5`;
      console.log("GPS API call:", url);

      const { data } = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("GPS Response:", data);

      if (data?.success && Array.isArray(data.data)) {
        setNearbyShops(data.data);
        console.log("GPS Shops loaded:", data.data);
        setShowResults(true);
      } else {
        setError("No shops found for your location");
        setNearbyShops([]);
      }
    } catch (err) {
      console.error("GPS API Error:", err);
      const message =
        err?.response?.data?.message || err.message || "Failed to fetch nearby shops";
      setError(message);
      setNearbyShops([]);
    } finally {
      setShopsLoading(false);
    }
  };

  // City API: /api/barbers/shops-by-city/{city}
  const fetchShopsByCity = async (city) => {
    setShopsLoading(true);
    setError("");
    setSearchType("city");

    try {
      const url = `http://localhost:5000/api/barbers/shops-by-city/${city.trim()}`;
      console.log("City API call:", url);

      const { data } = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("City Response:", data);

      if (data?.success && Array.isArray(data.data)) {
        setNearbyShops(data.data);
        console.log("City Shops loaded:", data.data);
        setShowResults(true);
      } else {
        setError("No shops found in this city");
        setNearbyShops([]);
      }
    } catch (err) {
      console.error("City API Error:", err);
      const message =
        err?.response?.data?.message || err.message || "Failed to fetch shops for this city";
      setError(message);
      setNearbyShops([]);
    } finally {
      setShopsLoading(false);
    }
  };

  // GPS Location Handler
  const handleGPSLocation = async () => {
    setLoading(true);
    setError("");
    setShowResults(false);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          console.log("GPS coords:", latitude, longitude);

          setCurrentLocation({ latitude, longitude });

          // Call GPS API
          await fetchNearbyShopsByGPS(latitude, longitude, maxDistance);

          // Pass location to parent
          if (onSelect) {
            onSelect({
              latitude,
              longitude,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              city: "",
              searchType: "gps",
            });
          }

          setLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to access location. Please enable location permissions.");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      console.error("Error:", err);
      setError(err?.message ? err.message : "Failed to get current location");
      setLoading(false);
    }
  };

  // Manual City Handler
  const handleManualLocation = async () => {
    if (!manualLocation.trim()) {
      setError("Please enter a valid location");
      return;
    }

    setLoading(true);
    setError("");
    setShowResults(false);

    try {
      const city = manualLocation.trim();

      // Call City API
      await fetchShopsByCity(city);

      // Pass location to parent
      if (onSelect) {
        onSelect({
          latitude: null,
          longitude: null,
          address: city,
          city: city,
          searchType: "city",
        });
      }

      setManualLocation("");
      setLoading(false);
    } catch (err) {
      console.error("Manual location error:", err);
      setError(err?.message ? err.message : "Failed to process location");
      setLoading(false);
    }
  };

  // Distance change (only for GPS)
  const handleDistanceChange = async (newDistance) => {
    setMaxDistance(newDistance);
    if (currentLocation && searchType === "gps") {
      await fetchNearbyShopsByGPS(
        currentLocation.latitude,
        currentLocation.longitude,
        newDistance
      );
    }
  };

  // Render shops results
  const renderShopsResults = () => {
    if (shopsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 text-blue-400 animate-spin mr-2" />
          <span className="text-gray-300">Finding nearby shops...</span>
        </div>
      );
    }

    if (!showResults || nearbyShops.length === 0) {
      return (
        <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-yellow-300 text-center">
            No barbershops found
            {searchType === "gps" ? ` within ${maxDistance} km` : " in this city"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-white">
            Found {nearbyShops.length} Nearby Shops
          </h4>
          {searchType === "gps" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Radius:</span>
              <select
                value={maxDistance}
                onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 text-sm"
              >
                <option value={1}>1 km</option>
                <option value={3}>3 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {nearbyShops.map((shop) => (
            <Link
              key={shop._id}
              href={`/shop/${shop._id}`}
              className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-800 transition group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h5 className="font-semibold text-white group-hover:text-blue-400 transition">
                    {shop.shopName}
                  </h5>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {shop.location?.address || "Address not available"}
                  </p>
                </div>
                {searchType === "gps" && shop.distance && (
                  <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full whitespace-nowrap">
                    {shop.distance.toFixed(2)} km
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {shop.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm text-gray-300">
                    {shop.ratings?.average?.toFixed(1) || "N/A"}{" "}
                    <span className="text-gray-500">
                      ({shop.ratings?.count || 0})
                    </span>
                  </span>
                </div>
                <span className="text-xs text-blue-400 group-hover:text-blue-300">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log("Nearby shops updated:", nearbyShops);
  }, [nearbyShops]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Enter Your Location
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
          We need your location to find nearby barbershops
        </p>
      </div>

      {/* GPS Option */}
      <div className="p-6 sm:p-8 bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-lg mb-4">
            <Navigation className="w-7 h-7 text-blue-400" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            Use Current Location
          </h4>
          <p className="text-gray-400 text-sm mb-6">
            Allow location access to automatically find nearby barbershops
          </p>
          <Button
            onClick={handleGPSLocation}
            disabled={loading}
            className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && !shopsLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Use GPS Location
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 h-0.5 bg-linear-to-r from-gray-800 to-transparent"></div>
        <span className="text-gray-500 text-xs font-semibold uppercase">
          OR
        </span>
        <div className="flex-1 h-0.5 bg-linear-to-l from-gray-800 to-transparent"></div>
      </div>

      {/* Manual Location Option */}
      <div className="p-6 sm:p-8 bg-linear-to-br from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-500/20 rounded-lg mb-4">
            <Search className="w-7 h-7 text-teal-400" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">
            Enter Location Manually
          </h4>
          <p className="text-gray-400 text-sm">
            Type your city name (e.g., Indore, Bhopal, Ujjain, Titra)
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-300 font-semibold">
              Your City
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter your city"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualLocation()}
              className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50 focus:bg-gray-800/80 transition rounded-lg py-2.5"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleManualLocation}
            disabled={loading || !manualLocation.trim()}
            className="w-full bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-2.5 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && !shopsLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Finding Location...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Barbershops
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Nearby Shops Results */}
      {renderShopsResults()}

      {/* Privacy Notice */}
      <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
        <p className="text-center text-gray-400 text-xs sm:text-sm">
          🔒 Your location will only be used to find nearby barbershops and will
          not be stored
        </p>
      </div>
    </div>
  );
}
