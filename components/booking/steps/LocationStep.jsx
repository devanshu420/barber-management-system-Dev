// "use client";

// import { useState, useCallback, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { MapPin, Navigation, Search, AlertCircle, Loader2, X } from "lucide-react";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// // Debounce utility
// function debounce(func, delay) {
//   let timeoutId;
//   return function (...args) {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// }

// export function LocationSelection({ onSelect }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [manualLocation, setManualLocation] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);
//   const [selectedShop, setSelectedShop] = useState(null);
//   const searchInputRef = useRef(null);
//   const dropdownRef = useRef(null);

//   // ============================================
//   // SEARCH SHOPS FUNCTION
//   // ============================================

//   const searchShops = useCallback(async (searchQuery) => {
//     if (!searchQuery || searchQuery.length < 2) {
//       setSearchResults([]);
//       setShowResults(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/shops/search?q=${encodeURIComponent(searchQuery)}&limit=10`
//       );

//       if (!response.ok) {
//         console.error("Search failed:", response.statusText);
//         setSearchResults([]);
//         setShowResults(false);
//         return;
//       }

//       const data = await response.json();

//       if (data.success && data.data) {
//         setSearchResults(data.data);
//         setShowResults(true);
//       } else {
//         setSearchResults([]);
//         setShowResults(false);
//       }
//     } catch (err) {
//       console.error("Search error:", err);
//       setSearchResults([]);
//       setShowResults(false);
//     }
//   }, []);

//   // Debounced search
//   const debouncedSearch = useCallback(debounce(searchShops, 300), [searchShops]);

//   // ============================================
//   // GPS LOCATION HANDLER
//   // ============================================

//   const handleGPSLocation = async () => {
//     setLoading(true);
//     setError("");
//     setShowResults(false);

//     try {
//       if (!navigator.geolocation) {
//         setError("Geolocation is not supported by your browser");
//         setLoading(false);
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           try {
//             const { latitude, longitude } = position.coords;

//             // Fetch nearby shops
//             const response = await fetch(
//               `${API_BASE_URL}/api/shops/nearby?lat=${latitude}&lng=${longitude}&radius_km=5&limit=20`
//             );

//             if (!response.ok) {
//               throw new Error("Failed to fetch nearby shops");
//             }

//             const data = await response.json();

//             onSelect({
//               latitude,
//               longitude,
//               address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
//               shops: data.success ? data.data : [],
//               source: "gps"
//             });

//             setLoading(false);
//           } catch (err) {
//             console.error("Error fetching nearby shops:", err);
//             // Still pass location even if shop fetch fails
//             onSelect({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//               address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
//               shops: [],
//               source: "gps"
//             });
//             setLoading(false);
//           }
//         },
//         (err) => {
//           setError("Unable to access location. Please enable location permissions.");
//           setLoading(false);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0
//         }
//       );
//     } catch (err) {
//       console.error("GPS error:", err);
//       setError("Failed to get location");
//       setLoading(false);
//     }
//   };

//   // ============================================
//   // HANDLE INPUT CHANGE
//   // ============================================

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setManualLocation(value);
//     setError("");
//     setSelectedShop(null);
//     debouncedSearch(value);
//   };

//   // ============================================
//   // HANDLE RESULT CLICK
//   // ============================================

//   const handleResultClick = (shop) => {
//     setManualLocation(shop.name);
//     setSelectedShop(shop);
//     setShowResults(false);

//     onSelect({
//       latitude: shop.latitude,
//       longitude: shop.longitude,
//       address: shop.address,
//       shopName: shop.name,
//       landmark: shop.landmark,
//       selectedShop: shop,
//       source: "manual"
//     });
//   };

//   // ============================================
//   // HANDLE MANUAL SEARCH SUBMIT
//   // ============================================

//   const handleManualSearch = async () => {
//     if (!manualLocation.trim()) {
//       setError("Please enter a valid location");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setShowResults(false);

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/shops/search?q=${encodeURIComponent(manualLocation)}&limit=20`
//       );

//       if (!response.ok) {
//         throw new Error("Search failed");
//       }

//       const data = await response.json();

//       if (data.success && data.data && data.data.length > 0) {
//         const topResult = data.data[0];
//         onSelect({
//           latitude: topResult.latitude,
//           longitude: topResult.longitude,
//           address: topResult.address,
//           searchQuery: manualLocation,
//           shops: data.data,
//           source: "manual"
//         });
//       } else {
//         setError("No shops found matching your search. Please try another location.");
//       }
//     } catch (err) {
//       console.error("Search error:", err);
//       setError("Failed to search shops. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============================================
//   // HANDLE KEY PRESS
//   // ============================================

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleManualSearch();
//     }
//   };

//   // ============================================
//   // CLOSE DROPDOWN ON OUTSIDE CLICK
//   // ============================================

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         searchInputRef.current &&
//         !searchInputRef.current.contains(event.target)
//       ) {
//         setShowResults(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ============================================
//   // CLEAR INPUT
//   // ============================================

//   const handleClearInput = () => {
//     setManualLocation("");
//     setSelectedShop(null);
//     setSearchResults([]);
//     setShowResults(false);
//     setError("");
//   };

//   return (
//     <div className="space-y-6">
//       {/* 🔹 Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
//           <MapPin className="w-8 h-8 text-blue-400" />
//         </div>
//         <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//           Enter Your Location
//         </h3>
//         <p className="text-gray-400 text-sm sm:text-base">
//           We need your location to find nearby barbershops
//         </p>
//       </div>

//       {/* 🔹 GPS Option */}
//       <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition">
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-lg mb-4">
//             <Navigation className="w-7 h-7 text-blue-400" />
//           </div>
//           <h4 className="text-lg font-bold text-white mb-2">
//             Use Current Location
//           </h4>
//           <p className="text-gray-400 text-sm mb-6">
//             Allow location access to automatically find nearby barbershops
//           </p>
//           <Button
//             onClick={handleGPSLocation}
//             disabled={loading}
//             className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 Getting Location...
//               </>
//             ) : (
//               <>
//                 <Navigation className="w-4 h-4 mr-2" />
//                 Use GPS Location
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* 🔹 Divider */}
//       <div className="flex items-center space-x-4">
//         <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-800 to-transparent"></div>
//         <span className="text-gray-500 text-xs font-semibold uppercase">OR</span>
//         <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-800 to-transparent"></div>
//       </div>

//       {/* 🔹 Manual Location Option */}
//       <div className="p-6 sm:p-8 bg-gradient-to-br from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-xl hover:border-teal-500/50 transition">
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-500/20 rounded-lg mb-4">
//             <Search className="w-7 h-7 text-teal-400" />
//           </div>
//           <h4 className="text-lg font-bold text-white mb-1">
//             Search by Location or Landmark
//           </h4>
//           <p className="text-gray-400 text-sm">
//             Type shop name, address, city, or landmark (e.g., "Shastri Chowraha", "Vijay Nagar")
//           </p>
//         </div>

//         <div className="space-y-4 max-w-md mx-auto">
//           {/* Input Field with Autocomplete */}
//           <div className="space-y-2 relative">
//             <Label htmlFor="location" className="text-gray-300 font-semibold">
//               Your Location
//             </Label>

//             <div className="relative">
//               <Input
//                 ref={searchInputRef}
//                 id="location"
//                 type="text"
//                 placeholder="Search shops, landmarks, or addresses..."
//                 value={manualLocation}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//                 onFocus={() => searchResults.length > 0 && setShowResults(true)}
//                 className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50 focus:bg-gray-800/80 transition rounded-lg py-2.5 pr-10"
//                 autoComplete="off"
//               />

//               {/* Clear Button */}
//               {manualLocation && (
//                 <button
//                   onClick={handleClearInput}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
//                   type="button"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {/* Search Results Dropdown */}
//             {showResults && searchResults.length > 0 && (
//               <div
//                 ref={dropdownRef}
//                 className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto"
//               >
//                 <div className="p-2">
//                   {searchResults.map((shop, index) => (
//                     <div
//                       key={shop.id || index}
//                       onClick={() => handleResultClick(shop)}
//                       className="p-3 hover:bg-gray-700/60 cursor-pointer transition rounded-md mb-1 border border-transparent hover:border-teal-500/30"
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="font-semibold text-white text-sm">
//                             {shop.name}
//                           </div>
//                           <div className="text-xs text-gray-400 mt-1">
//                             {shop.landmark && (
//                               <span className="text-teal-400 font-medium">
//                                 📍 {shop.landmark} •{" "}
//                               </span>
//                             )}
//                             {shop.city && (
//                               <span>{shop.city}</span>
//                             )}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1 truncate">
//                             {shop.address}
//                           </div>
//                         </div>
//                         {shop.rating && (
//                           <div className="ml-2 text-xs text-yellow-400 font-semibold">
//                             ⭐ {shop.rating}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* No Results Message */}
//             {showResults && searchResults.length === 0 && manualLocation.length >= 2 && (
//               <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4">
//                 <p className="text-gray-400 text-sm text-center">
//                   No shops found. Try searching by shop name or landmark.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Selected Shop Display */}
//           {selectedShop && (
//             <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
//               <p className="text-teal-300 text-sm">
//                 ✓ Selected: <strong>{selectedShop.name}</strong>
//               </p>
//             </div>
//           )}

//           {/* Submit Button */}
//           <Button
//             onClick={handleManualSearch}
//             disabled={loading || !manualLocation.trim()}
//             className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-2.5 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 Searching...
//               </>
//             ) : (
//               <>
//                 <Search className="w-4 h-4 mr-2" />
//                 Find Barbershops
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* 🔹 Error Message */}
//       {error && (
//         <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3 animate-in fade-in">
//           <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//           <p className="text-red-300 text-sm">{error}</p>
//         </div>
//       )}

//       {/* 🔹 Privacy Notice */}
//       <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
//         <p className="text-center text-gray-400 text-xs sm:text-sm">
//           🔒 Your location is used only to find nearby barbershops and is not stored permanently
//         </p>
//       </div>
//     </div>
//   );
// }








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

