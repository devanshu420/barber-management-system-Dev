
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Star, Users, Clock, AlertCircle, Loader } from "lucide-react";
import axios from "axios";

function getWaitlistColor(waitlist) {
  if (waitlist === 0) return "bg-green-500/20 border-green-500/50 text-green-400";
  if (waitlist <= 2) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
  return "bg-red-500/20 border-red-500/50 text-red-400";
}

function getWaitlistText(waitlist) {
  if (waitlist === 0) return "No wait";
  if (waitlist === 1) return "1 person";
  return `${waitlist} people`;
}

export function ShopSelection({ userLocation, onSelect, maxDistance = 5 }) {
  const [selectedShop, setSelectedShop] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch shops by GPS
  const fetchShopsByGPS = async (latitude, longitude, distance = 5) => {
    try {
      const url = `http://localhost:5000/api/barbers/nearby-shops?latitude=${latitude}&longitude=${longitude}&maxDistance=${distance}&limit=5`;
      console.log("ShopSelection GPS API:", url);

      const { data } = await axios.get(url);
      console.log("ShopSelection GPS Response:", data);

      if (data.success && Array.isArray(data.data)) {
        const shops = data.data.map((shop) => ({
          ...shop,
          id: shop._id,
          name: shop.shopName,
          address: shop.location?.address || "Address not available",
          distance: shop.distance || 0,
          rating: shop.ratings?.average || 0,
          reviews: shop.ratings?.count || 0,
          image: shop.images?.[0] || "https://via.placeholder.com/300?text=Barbershop",
          waitlist: shop.currentQueue?.length || 0,
          barbers: shop.staff?.length || 0,
        }));

        setNearbyShops(shops);
        console.log("Shops formatted:", shops);
      } else {
        setError("No nearby shops found");
        setNearbyShops([]);
      }
    } catch (err) {
      console.error("GPS Error:", err);
      setError(err?.response?.data?.message || "Failed to fetch nearby shops");
    }
  };

  // Fetch shops by city
  const fetchShopsByCity = async (city) => {
    try {
      const url = `http://localhost:5000/api/barbers/shops-by-city/${city.trim()}`;
      console.log("ShopSelection City API:", url);

      const { data } = await axios.get(url);
      console.log("ShopSelection City Response:", data);

      if (data.success && Array.isArray(data.data)) {
        const shops = data.data.map((shop) => ({
          ...shop,
          id: shop._id,
          name: shop.shopName,
          address: shop.location?.address || "Address not available",
          distance: shop.distance || 0,
          rating: shop.ratings?.average || 0,
          reviews: shop.ratings?.count || 0,
          image: shop.images?.[0] || "https://via.placeholder.com/300?text=Barbershop",
          waitlist: shop.currentQueue?.length || 0,
          barbers: shop.staff?.length || 0,
        }));

        setNearbyShops(shops);
        console.log("Shops formatted:", shops);
      } else {
        setError("No shops found in this city");
        setNearbyShops([]);
      }
    } catch (err) {
      console.error("City Error:", err);
      setError(err?.response?.data?.message || "Failed to fetch shops for this city");
    }
  };

  useEffect(() => {
    if (!userLocation) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const loadShops = async () => {
      try {
        // If GPS location
        if (userLocation.searchType === "gps" || (userLocation.latitude && userLocation.longitude)) {
          await fetchShopsByGPS(userLocation.latitude, userLocation.longitude, maxDistance);
        }
        // If city/manual search
        else if (userLocation.searchType === "city" || userLocation.city) {
          await fetchShopsByCity(userLocation.city);
        }
      } catch (err) {
        console.error("Error loading shops:", err);
        setError("Failed to load shops");
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, [userLocation, maxDistance]);

  const handleContinue = () => {
    if (selectedShop && onSelect) {
      onSelect(selectedShop);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-gray-400">Loading nearby barbershops...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-full mb-4 border border-indigo-500/30">
          <Building2 className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Choose Your Barbershop
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
          {userLocation?.address && (
            <span>
              Shops near <strong>{userLocation.address}</strong>
            </span>
          )}
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Shops Grid */}
      {nearbyShops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyShops.map((shop, idx) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedShop(shop)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col h-full group ${
                selectedShop?.id === shop.id
                  ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20"
                  : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50 hover:bg-gray-800/50"
              }`}
            >
              {/* Shop Image */}
              <div className="relative mb-4 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-32 sm:h-40 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300?text=Barbershop";
                  }}
                />
                {selectedShop?.id === shop.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>

              {/* Shop Name */}
              <h4 className="text-lg font-bold text-white truncate mb-2 group-hover:text-teal-300 transition-colors">
                {shop.name}
              </h4>

              {/* Address */}
              <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm mb-3">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{shop.address}</span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 flex-1">
                {/* Distance and Rating */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{shop.distance?.toFixed(1) || "N/A"} km</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 flex-shrink-0" />
                    <span className="font-semibold">{shop.rating?.toFixed(1) || "N/A"}</span>
                    <span className="text-gray-400">({shop.reviews || 0})</span>
                  </div>
                </div>

                {/* Barbers */}
                <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {shop.barbers || 0} barber{shop.barbers !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Waitlist */}
              <div
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold mb-4 ${getWaitlistColor(
                  shop.waitlist
                )}`}
              >
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{getWaitlistText(shop.waitlist)}</span>
              </div>

              {/* Select Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedShop(shop)}
                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                  selectedShop?.id === shop.id
                    ? "bg-teal-500 hover:bg-teal-600 text-black"
                    : "bg-gray-700 hover:bg-teal-500 text-white hover:text-black"
                }`}
              >
                {selectedShop?.id === shop.id ? "Selected ✓" : "Select"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Shops Found */}
      {!loading && nearbyShops.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-400">No barbershops found in this area</p>
        </div>
      )}

      {/* Continue Button */}
      {selectedShop && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleContinue}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-black font-semibold rounded-lg transition transform hover:scale-105 shadow-lg hover:shadow-teal-500/30"
        >
          Continue to Service Selection
        </motion.button>
      )}
    </div>
  );
}
