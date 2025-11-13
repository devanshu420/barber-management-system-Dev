"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Star, Users, Clock, AlertCircle, Loader } from "lucide-react";
import axios from "axios";

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

export function ShopSelection({ userLocation, onSelect }) {
  const [selectedShop, setSelectedShop] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNearbyShops() {
      setLoading(true);
      setError("");

      try {
        if (!userLocation) {
          setError("Location not provided");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/barbers/shops");
        console.log("API RESPONSE:", response.data);


        if (response.data.success) {
          let shops = response.data.data || [];

          // if (userLocation.city) {
          //   shops = shops.filter((shop) =>
          //     shop.location?.city?.toLowerCase().includes(userLocation.city.toLowerCase())
          //   );
          // }

          const userCity =
  userLocation.city ||
  (userLocation.address?.split(",")[0] || "").trim().toLowerCase();

shops = shops.filter((shop) =>
  shop.location?.city?.toLowerCase().includes(userCity)
);


          const shopsWithDistance = shops.map((shop) => {
            let distance = 0;

            if (shop.location?.coordinates?.lat && shop.location?.coordinates?.lng) {
              distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                shop.location.coordinates.lat,
                shop.location.coordinates.lng
              );
            }

            return {
              ...shop,
              id: shop._id,
              name: shop.shopName,
              address: `${shop.location?.address}, ${shop.location?.city}`,
              distance: distance,
              rating: shop.ratings?.average || 0,
              reviews: shop.ratings?.count || 0,
              image: shop.image || "https://via.placeholder.com/300?text=Shop",
              waitlist: shop.earnings?.pending || 0,
              barbers: shop.staff?.length || 0,
            };
          });

          const sorted = shopsWithDistance.sort((a, b) => a.distance - b.distance);
          setNearbyShops(sorted);
        } else {
          setError("Failed to fetch shops");
        }
      } catch (err) {
        setError("Unable to load nearby shops. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchNearbyShops();
  }, [userLocation]);

  const handleContinue = () => {
    if (selectedShop) onSelect(selectedShop);
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

      {/* Error State */}
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

      {/* Empty State */}
      {nearbyShops.length === 0 && !error && (
        <div className="text-center py-12 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            No barbershops found in {userLocation?.address}
          </p>
        </div>
      )}

      {/* Shops Grid */}
      {nearbyShops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyShops.map((shop, idx) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedShop(shop)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col h-full group ${selectedShop?.id === shop.id
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
                />
                {selectedShop?.id === shop.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <h4 className="text-lg font-bold text-white truncate mb-2 group-hover:text-teal-300 transition-colors">
                {shop.name}
              </h4>

              <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm mb-3">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{shop.address}</span>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{shop.distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 flex-shrink-0" />
                    <span className="font-semibold">{shop.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({shop.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{shop.barbers} barber{shop.barbers > 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Waitlist Badge */}
              <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold mb-4 ${getWaitlistColor(shop.waitlist)}`}>
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{getWaitlistText(shop.waitlist)}</span>
              </div>

              {/* Select Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedShop(shop)}
                className={`w-full py-2 rounded-lg font-semibold transition-all ${selectedShop?.id === shop.id
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

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Building2, MapPin, Star, Users, Clock, AlertCircle } from "lucide-react";
// import axios from "axios";

// // 🔹 Distance calculation function
// function calculateDistance(lat1, lng1, lat2, lng2) {
//   const R = 6371; // Earth's radius in km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLng = ((lng2 - lng1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLng / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// // 🔹 Get waitlist color based on count
// function getWaitlistColor(waitlist) {
//   if (waitlist === 0) return "bg-green-500/20 border-green-500/50 text-green-400";
//   if (waitlist <= 2) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
//   return "bg-red-500/20 border-red-500/50 text-red-400";
// }

// // 🔹 Get waitlist text
// function getWaitlistText(waitlist) {
//   if (waitlist === 0) return "No wait";
//   if (waitlist === 1) return "1 person";
//   return `${waitlist} people`;
// }

// export function ShopSelection({ userLocation, onSelect }) {
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [nearbyShops, setNearbyShops] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // 🔹 Fetch shops from backend
//   useEffect(() => {
//     async function fetchNearbyShops() {
//       setLoading(true);
//       setError("");

//       try {
//         if (!userLocation) {
//           setError("Location not provided");
//           setLoading(false);
//           return;
//         }

//         // Call backend API to get shops (based on location or all active shops)
//         const response = await axios.get(
//           `http://localhost:5000/api/barbers/all-shops`
//         );

//         if (response.data.success) {
//           let shops = response.data.shops || [];

//           // Filter shops based on city/location
//           if (userLocation.address) {
//             shops = shops.filter((shop) =>
//               shop.location?.city?.toLowerCase().includes(userLocation.address.toLowerCase())
//             );
//           }

//           // Calculate distances if we have coordinates
//           const shopsWithDistance = shops.map((shop) => {
//             let distance = 0;

//             // If shop has coordinates, calculate distance
//             if (
//               shop.location?.coordinates?.lat &&
//               shop.location?.coordinates?.lng
//             ) {
//               distance = calculateDistance(
//                 userLocation.latitude,
//                 userLocation.longitude,
//                 shop.location.coordinates.lat,
//                 shop.location.coordinates.lng
//               );
//             }

//             return {
//               ...shop,
//               id: shop._id,
//               name: shop.shopName,
//               address: `${shop.location?.address}, ${shop.location?.city}`,
//               coordinates: {
//                 lat: shop.location?.coordinates?.lat || 0,
//                 lng: shop.location?.coordinates?.lng || 0,
//               },
//               distance: distance,
//               rating: shop.ratings?.average || 0,
//               reviews: shop.ratings?.count || 0,
//               image: shop.image || "https://via.placeholder.com/80?text=Shop",
//               waitlist: shop.earnings?.pending || 0,
//               barbers: shop.staff?.length || 0,
//             };
//           });

//           // Sort by distance
//           const sorted = shopsWithDistance.sort(
//             (a, b) => a.distance - b.distance
//           );

//           setNearbyShops(sorted);
//         } else {
//           setError("Failed to fetch shops");
//         }
//       } catch (err) {
//         console.error("Error fetching shops:", err);
//         setError("Unable to load nearby shops. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchNearbyShops();
//   }, [userLocation]);

//   const handleSelectShop = (shop) => {
//     setSelectedShop(shop);
//   };

//   const handleContinue = () => {
//     if (selectedShop) {
//       onSelect(selectedShop);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="text-center py-12">
//           <p className="text-gray-400">Loading nearby barbershops...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* 🔹 Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
//           <Building2 className="w-8 h-8 text-indigo-400" />
//         </div>
//         <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//           Choose Your Barbershop
//         </h3>
//         <p className="text-gray-400 text-sm sm:text-base">
//           {userLocation?.address && (
//             <span>Shops near <strong>{userLocation.address}</strong></span>
//           )}
//         </p>
//       </div>

//       {/* 🔹 Error State */}
//       {error && (
//         <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
//           <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//           <p className="text-red-300 text-sm">{error}</p>
//         </div>
//       )}

//       {/* 🔹 Empty State */}
//       {nearbyShops.length === 0 ? (
//         <div className="text-center py-12 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl">
//           <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
//           <p className="text-gray-400">
//             No barbershops found in {userLocation?.address}
//           </p>
//         </div>
//       ) : (
//         /* 🔹 Shops Grid */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
//           {nearbyShops.map((shop) => (
//             <div
//               key={shop.id}
//               onClick={() => handleSelectShop(shop)}
//               className={`p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col ${
//                 selectedShop?.id === shop.id
//                   ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20"
//                   : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50 hover:bg-gray-800/50"
//               }`}
//             >
//               {/* Shop Image */}
//               <div className="relative mb-4">
//                 <img
//                   src={shop.image}
//                   alt={shop.name}
//                   className="w-full h-32 sm:h-40 rounded-lg object-cover"
//                 />
//                 {/* Selection Overlay */}
//                 {selectedShop?.id === shop.id && (
//                   <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
//                     <span className="text-white text-sm font-bold">✓</span>
//                   </div>
//                 )}
//               </div>

//               {/* Shop Info */}
//               <div className="flex-1">
//                 <h4 className="text-lg sm:text-xl font-bold text-white truncate mb-1">
//                   {shop.name}
//                 </h4>
//                 <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm mb-3">
//                   <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
//                   <span className="truncate">{shop.address}</span>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="space-y-2 mb-4">
//                   {/* Distance & Rating Row */}
//                   <div className="flex items-center justify-between text-xs sm:text-sm">
//                     <div className="flex items-center space-x-1 text-gray-400">
//                       <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
//                       <span>{shop.distance.toFixed(1)} km</span>
//                     </div>
//                     <div className="flex items-center space-x-1 text-yellow-400">
//                       <Star className="w-3.5 h-3.5 fill-yellow-400 flex-shrink-0" />
//                       <span className="font-semibold">{shop.rating.toFixed(1)}</span>
//                       <span className="text-gray-400">({shop.reviews})</span>
//                     </div>
//                   </div>

//                   {/* Barbers Row */}
//                   <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm">
//                     <Users className="w-3.5 h-3.5 flex-shrink-0" />
//                     <span>
//                       {shop.barbers} barber{shop.barbers > 1 ? "s" : ""}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Waitlist Badge */}
//                 <div className="mb-4">
//                   <div
//                     className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold ${getWaitlistColor(
//                       shop.waitlist
//                     )}`}
//                   >
//                     <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
//                     <span>{getWaitlistText(shop.waitlist)}</span>
//                   </div>
//                 </div>

//                 {/* Select Button */}
//                 <Button
//                   onClick={() => handleSelectShop(shop)}
//                   className={`w-full py-2 rounded-lg font-semibold transition-all ${
//                     selectedShop?.id === shop.id
//                       ? "bg-teal-500 hover:bg-teal-600 text-black"
//                       : "bg-gray-700 hover:bg-teal-500 text-white hover:text-black"
//                   }`}
//                 >
//                   {selectedShop?.id === shop.id ? "Selected ✓" : "Select"}
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 🔹 Continue Button */}
//       {selectedShop && (
//         <Button
//           onClick={handleContinue}
//           className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-105"
//         >
//           Continue to Service Selection
//         </Button>
//       )}
//     </div>
//   );
// }

