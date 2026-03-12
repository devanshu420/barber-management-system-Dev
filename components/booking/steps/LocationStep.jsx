"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Navigation,
  Search,
  AlertCircle,
  Loader,
} from "lucide-react";
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

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://barber-book-155830263049.asia-south1.run.app";

  // GPS API: /api/barbers/nearby-shops?latitude=...&longitude=...
  const fetchNearbyShopsByGPS = async (latitude, longitude, distance = 5) => {
    setShopsLoading(true);
    setError("");
    setSearchType("gps");

    try {
      const url = `${API_BASE_URL}/api/barbers/nearby-shops?latitude=${latitude}&longitude=${longitude}&maxDistance=${distance}&limit=5`;

      const { data } = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (data?.success && Array.isArray(data.data)) {
        setNearbyShops(data.data);
        setShowResults(true);
      } else {
        setNearbyShops([]);
        setShowResults(false);
      }
    } catch (err) {
      console.error("GPS API Error:", err);
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch nearby shops";
      setError(message);
      setNearbyShops([]);
      setShowResults(false);
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
      const url = `${API_BASE_URL}/api/barbers/shops-by-city/${city.trim()}`;

      const { data } = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (data?.success && Array.isArray(data.data)) {
        setNearbyShops(data.data);
        setShowResults(true);
      } else {
        setNearbyShops([]);
        setShowResults(false);
      }
    } catch (err) {
      console.error("City API Error:", err);
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch shops for this city";
      setError(message);
      setNearbyShops([]);
      setShowResults(false);
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
          setError(
            "Unable to access location. Please enable location permissions."
          );
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
      setError(
        err?.message ? err.message : "Failed to get current location"
      );
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
      setError(
        err?.message ? err.message : "Failed to process location"
      );
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
        <div className="flex items-center justify-center py-10">
          <Loader className="w-6 h-6 text-teal-400 animate-spin mr-2" />
          <span className="text-gray-300 text-sm sm:text-base">
            Finding nearby shops...
          </span>
        </div>
      );
    }

    if (!showResults || nearbyShops.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h4 className="text-lg font-semibold text-white">
            Found {nearbyShops.length} nearby shops
          </h4>
          {searchType === "gps" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Radius:</span>
              <select
                value={maxDistance}
                onChange={(e) =>
                  handleDistanceChange(parseFloat(e.target.value))
                }
                className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
          {nearbyShops.map((shop) => (
            <Link
              key={shop._id}
              href={`/shop/${shop._id}`}
              className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl hover:border-teal-500/70 hover:bg-gray-900 transition group cursor-pointer shadow-sm hover:shadow-[0_14px_35px_rgba(45,212,191,0.35)]"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h5 className="font-semibold text-white group-hover:text-teal-300 transition-colors text-sm sm:text-base">
                    {shop.shopName}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">
                    {shop.location?.address || "Address not available"}
                  </p>
                </div>
                {searchType === "gps" && shop.distance && (
                  <span className="ml-2 px-2 py-1 bg-teal-500/15 text-teal-300 text-[11px] rounded-full whitespace-nowrap">
                    {shop.distance.toFixed(2)} km
                  </span>
                )}
              </div>

              <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 mb-3">
                {shop.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-xs sm:text-sm text-gray-300">
                    {shop.ratings?.average?.toFixed(1) || "N/A"}{" "}
                    <span className="text-gray-500">
                      ({shop.ratings?.count || 0})
                    </span>
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-teal-400 group-hover:text-teal-300">
                  View details →
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
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-teal-500/15 rounded-full mb-4 shadow-[0_0_24px_rgba(45,212,191,0.4)]">
          <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-teal-300" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Choose your location
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
          Use GPS for quick results or enter your city to explore nearby
          barbershops.
        </p>
      </div>

      {/* GPS & Manual side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* GPS Option */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-cyan-500/12 to-cyan-600/8 border border-cyan-500/35 rounded-2xl shadow-[0_16px_40px_rgba(8,47,73,0.75)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-cyan-500/15 rounded-xl flex items-center justify-center">
              <Navigation className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="text-left">
              <h4 className="text-sm sm:text-base font-semibold text-white">
                Use current location
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Fastest way to find barbers near you.
              </p>
            </div>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            We&apos;ll ask for permission to access your device location.
          </p>

          <Button
            onClick={handleGPSLocation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-semibold py-2.5 rounded-xl transition-transform duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading && !shopsLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Use GPS location
              </>
            )}
          </Button>
        </div>

        {/* Manual Location Option */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/35 rounded-2xl shadow-[0_16px_40px_rgba(6,78,59,0.75)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-emerald-500/15 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="text-left">
              <h4 className="text-sm sm:text-base font-semibold text-white">
                Enter location manually
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-300">
                Type your city to find nearby shops.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="location"
                className="text-gray-200 text-xs sm:text-sm font-medium"
              >
                Your city
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g. Indore, Bhopal, Ujjain"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleManualLocation()
                }
                className="bg-gray-950/80 border border-gray-800 text-white placeholder:text-gray-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition rounded-xl py-2.5 text-xs sm:text-sm"
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleManualLocation}
              disabled={loading || !manualLocation.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold py-2.5 rounded-xl transition-transform duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading && !shopsLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Finding barbershops...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find barbershops
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Nearby Shops Results */}
      {renderShopsResults()}

      {/* Privacy Notice */}
      <div className="p-4 bg-gray-900/60 border border-gray-800/80 rounded-xl">
        <p className="text-center text-gray-400 text-[11px] sm:text-xs">
          🔒 Your location is used only to find nearby barbershops and is
          not permanently stored.
        </p>
      </div>
    </div>
  );
}
