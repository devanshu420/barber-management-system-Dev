
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Star, Users, Clock } from "lucide-react";

// Mock shops data with coordinates
const barbershops = [
  {
    id: 1,
    name: "Downtown Salon",
    address: "123 Main St",
    coordinates: { lat: 40.7128, lng: -74.006 },
    distance: 0.5,
    rating: 4.8,
    reviews: 245,
    image: "https://via.placeholder.com/80?text=Shop1",
    waitlist: 0,
    barbers: 3,
  },
  {
    id: 2,
    name: "Main Street Barber",
    address: "456 Market Ave",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    distance: 1.2,
    rating: 4.9,
    reviews: 312,
    image: "https://via.placeholder.com/80?text=Shop2",
    waitlist: 2,
    barbers: 2,
  },
  {
    id: 3,
    name: "Premium Grooming",
    address: "789 Central Blvd",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    distance: 1.8,
    rating: 4.7,
    reviews: 189,
    image: "https://via.placeholder.com/80?text=Shop3",
    waitlist: 1,
    barbers: 4,
  },
];

// 🔹 Distance calculation function
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
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

// 🔹 Get waitlist color based on count
function getWaitlistColor(waitlist) {
  if (waitlist === 0) return "bg-green-500/20 border-green-500/50 text-green-400";
  if (waitlist <= 2) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
  return "bg-red-500/20 border-red-500/50 text-red-400";
}

// 🔹 Get waitlist text
function getWaitlistText(waitlist) {
  if (waitlist === 0) return "No wait";
  if (waitlist === 1) return "1 person";
  return `${waitlist} people`;
}

export function ShopSelection({ userLocation, onSelect }) {
  const [selectedShop, setSelectedShop] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Calculate distances and sort shops
  useEffect(() => {
    if (!userLocation) {
      setNearbyShops(barbershops);
      setLoading(false);
      return;
    }

    const shopsWithDistance = barbershops.map((shop) => ({
      ...shop,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        shop.coordinates.lat,
        shop.coordinates.lng
      ),
    }));

    // Sort by waitlist first, then by distance
    const sorted = shopsWithDistance.sort((a, b) =>
      a.waitlist !== b.waitlist ? a.waitlist - b.waitlist : a.distance - b.distance
    );

    setNearbyShops(sorted.slice(0, 10));
    setLoading(false);
  }, [userLocation]);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    onSelect(shop);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading nearby barbershops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Choose Your Barbershop
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
          Select from nearby barbershops with the shortest wait times
        </p>
      </div>

      {/* 🔹 Empty State */}
      {nearbyShops.length === 0 ? (
        <div className="text-center py-12 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No barbershops found nearby</p>
        </div>
      ) : (
        /* 🔹 Shops Grid (Horizontal) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {nearbyShops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => handleSelectShop(shop)}
              className={`p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col ${
                selectedShop?.id === shop.id
                  ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20"
                  : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50 hover:bg-gray-800/50"
              }`}
            >
              {/* Shop Image */}
              <div className="relative mb-4">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-32 sm:h-40 rounded-lg object-cover"
                />
                {/* Selection Overlay */}
                {selectedShop?.id === shop.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>

              {/* Shop Info */}
              <div className="flex-1">
                <h4 className="text-lg sm:text-xl font-bold text-white truncate mb-1">
                  {shop.name}
                </h4>
                <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{shop.address}</span>
                </div>

                {/* Stats Grid */}
                <div className="space-y-2 mb-4">
                  {/* Distance & Rating Row */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{shop.distance.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 flex-shrink-0" />
                      <span className="font-semibold">{shop.rating}</span>
                      <span className="text-gray-400">({shop.reviews})</span>
                    </div>
                  </div>

                  {/* Barbers Row */}
                  <div className="flex items-center space-x-1 text-gray-400 text-xs sm:text-sm">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{shop.barbers} barber{shop.barbers > 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Waitlist Badge */}
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold ${getWaitlistColor(
                      shop.waitlist
                    )}`}
                  >
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span>{getWaitlistText(shop.waitlist)}</span>
                  </div>
                </div>

                {/* Select Button */}
                <Button
                  onClick={() => handleSelectShop(shop)}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    selectedShop?.id === shop.id
                      ? "bg-teal-500 hover:bg-teal-600 text-black"
                      : "bg-gray-700 hover:bg-teal-500 text-white hover:text-black"
                  }`}
                >
                  {selectedShop?.id === shop.id ? "Selected ✓" : "Select"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Continue Button */}
      {selectedShop && (
        <Button
          onClick={() => onSelect(selectedShop)}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg transition transform hover:scale-105"
        >
          Continue to Barber Selection
        </Button>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Building2, MapPin, Star } from "lucide-react";

// // Mock shops data
// const mockShops = [
//   {
//     id: 1,
//     name: "Downtown Salon",
//     distance: 0.5,
//     rating: 4.8,
//     reviews: 245,
//     image: "https://via.placeholder.com/80?text=Shop1",
//     address: "123 Main St",
//   },
//   {
//     id: 2,
//     name: "Main Street Barber",
//     distance: 1.2,
//     rating: 4.9,
//     reviews: 312,
//     image: "https://via.placeholder.com/80?text=Shop2",
//     address: "456 Market Ave",
//   },
//   {
//     id: 3,
//     name: "Premium Grooming",
//     distance: 1.8,
//     rating: 4.7,
//     reviews: 189,
//     image: "https://via.placeholder.com/80?text=Shop3",
//     address: "789 Central Blvd",
//   },
// ];

// export function ShopSelection({ userLocation, onSelect }) {
//   const [selectedShop, setSelectedShop] = useState(null);

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
//           <Building2 className="w-8 h-8 text-blue-400" />
//         </div>
//         <h3 className="text-2xl font-bold text-white mb-2">Choose Your Barbershop</h3>
//         <p className="text-gray-400">Select from nearby barbershops</p>
//       </div>

//       <div className="space-y-4">
//         {mockShops.map((shop) => (
//           <div
//             key={shop.id}
//             onClick={() => setSelectedShop(shop)}
//             className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
//               selectedShop?.id === shop.id
//                 ? "border-teal-500 bg-teal-500/10"
//                 : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50"
//             }`}
//           >
//             <div className="flex items-start space-x-4">
//               <img
//                 src={shop.image}
//                 alt={shop.name}
//                 className="w-16 h-16 rounded-lg object-cover"
//               />
//               <div className="flex-1">
//                 <h4 className="text-lg font-bold text-white">{shop.name}</h4>
//                 <div className="flex items-center space-x-4 mt-2 text-sm">
//                   <div className="flex items-center space-x-1 text-gray-400">
//                     <MapPin className="w-4 h-4" />
//                     <span>{shop.distance} km</span>
//                   </div>
//                   <div className="flex items-center space-x-1 text-yellow-400">
//                     <Star className="w-4 h-4 fill-yellow-400" />
//                     <span>{shop.rating}</span>
//                     <span className="text-gray-400">({shop.reviews})</span>
//                   </div>
//                 </div>
//                 <p className="text-gray-400 text-xs mt-1">{shop.address}</p>
//               </div>
//               {selectedShop?.id === shop.id && (
//                 <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
//                   <span className="text-white text-sm font-bold">✓</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <Button
//         onClick={() => selectedShop && onSelect(selectedShop)}
//         disabled={!selectedShop}
//         className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-black font-semibold rounded-lg"
//       >
//         Continue to Barber Selection
//       </Button>
//     </div>
//   );
// }