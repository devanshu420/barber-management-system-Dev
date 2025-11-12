"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors, Clock, IndianRupee, AlertCircle, Loader } from "lucide-react";
import axios from "axios";

export function ServiceSelection({ onSelect, shop }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError("");
      setServices([]);

      try {
        if (!shop) {
          setError("Shop not selected. Please go back and select a shop.");
          setLoading(false);
          return;
        }

        const shopId = shop._id || shop.id;

        if (!shopId) {
          setError("Invalid shop ID. Please select a shop again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/barbers/barber-shop/${shopId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const shopData = response.data.shop;
          const fetchedServices = shopData.services || [];

          if (fetchedServices.length === 0) {
            setError("No services available for this shop");
            setLoading(false);
            return;
          }

          const transformedServices = fetchedServices.map((service, index) => ({
            id: service._id || `service_${index}`,
            name: service.name || "Unnamed Service",
            description: service.description || "Professional service",
            price: service.price || 0,
            duration: service.duration || 30,
            category: service.category || "General",
          }));

          setServices(transformedServices);
        } else {
          setError(response.data.message || "Failed to fetch shop services");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.");
        } else if (err.response?.status === 404) {
          setError("Shop not found. Please select a different shop.");
        } else {
          setError("Unable to load services. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [shop]);

  const toggleService = (service) => {
    setSelectedServices([service]);
  };

  const isSelected = (service) => selectedServices.find((s) => s.id === service.id);

  const getTotalPrice = () => {
    return selectedServices.reduce((total, s) => total + s.price, 0);
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      onSelect(selectedServices[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader className="w-8 h-8 text-orange-400 animate-spin" />
        <p className="text-gray-400">Loading services...</p>
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-full mb-4 border border-orange-500/30">
          <Scissors className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Select Service</h3>
        <p className="text-gray-400 text-sm sm:text-base">
          {shop?.name && (
            <span>
              Choose a service at <strong>{shop.name}</strong>
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
      {services.length === 0 && !error && (
        <div className="text-center py-12 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl">
          <Scissors className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No services available</p>
        </div>
      )}

      {/* Services List */}
      {services.length > 0 && (
        <div className="space-y-4">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => toggleService(service)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all group ${
                isSelected(service)
                  ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20"
                  : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50 hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icon Badge */}
                  <div className="w-14 h-14 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-7 h-7 text-orange-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">{service.description}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{service.duration} min</span>
                      </div>

                      <div className="flex items-center space-x-1 text-teal-400 font-semibold">
                        <IndianRupee className="w-4 h-4 flex-shrink-0" />
                        <span>₹{service.price}</span>
                      </div>

                      {service.category && (
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs">
                          {service.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkmark */}
                {isSelected(service) && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 ml-4 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Selected Service</p>
              <p className="text-white font-semibold">{selectedServices[0].name}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Price</p>
              <p className="text-teal-400 font-bold text-lg">₹{getTotalPrice()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleContinue}
        disabled={selectedServices.length === 0}
        className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition transform shadow-lg hover:shadow-teal-500/30"
      >
        {selectedServices.length === 0 ? "Select a Service" : "Continue to Time Selection"}
      </motion.button>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Scissors, Clock, IndianRupee, AlertCircle } from "lucide-react";
// import axios from "axios";

// export function ServiceSelection({ onSelect, shop }) {
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // 🔹 Fetch services from backend
//   useEffect(() => {
//     async function fetchServices() {
//       setLoading(true);
//       setError("");
//       setServices([]);

//       try {
//         console.log("Shop object received:", shop); // Debug

//         if (!shop) {
//           setError("Shop not selected. Please go back and select a shop.");
//           setLoading(false);
//           return;
//         }

//         // Use shop._id if available, otherwise use shop.id
//         const shopId = shop._id || shop.id;

//         if (!shopId) {
//           setError("Invalid shop ID. Please select a shop again.");
//           setLoading(false);
//           return;
//         }

//         console.log("Fetching services for shopId:", shopId); // Debug

//         // Get shop details including services
//         const response = await axios.get(
//           `http://localhost:5000/api/barbers/barber-shop/${shopId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         console.log("Services response:", response.data); // Debug

//         if (response.data.success) {
//           const shopData = response.data.shop;
//           const fetchedServices = shopData.services || [];

//           if (fetchedServices.length === 0) {
//             setError("No services available for this shop");
//             setLoading(false);
//             return;
//           }

//           // Transform services data
//           const transformedServices = fetchedServices.map((service, index) => ({
//             id: service._id || `service_${index}`,
//             name: service.name || "Unnamed Service",
//             description: service.description || "Professional service",
//             price: service.price || 0,
//             duration: service.duration || 30,
//             category: service.category || "General",
//           }));

//           console.log("Transformed services:", transformedServices); // Debug

//           setServices(transformedServices);
//         } else {
//           setError(response.data.message || "Failed to fetch shop services");
//         }
//       } catch (err) {
//         console.error("Error fetching services:", err);
        
//         if (err.response?.status === 401) {
//           setError("Authentication failed. Please login again.");
//         } else if (err.response?.status === 404) {
//           setError("Shop not found. Please select a different shop.");
//         } else {
//           setError("Unable to load services. Please try again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchServices();
//   }, [shop]);

//   const toggleService = (service) => {
//     if (selectedServices.find((s) => s.id === service.id)) {
//       setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
//     } else {
//       // Only one service at a time
//       setSelectedServices([service]);
//     }
//   };

//   const isSelected = (service) =>
//     selectedServices.find((s) => s.id === service.id);

//   const getTotalPrice = () => {
//     return selectedServices.reduce((total, s) => total + s.price, 0);
//   };

//   const handleContinue = () => {
//     if (selectedServices.length > 0) {
//       onSelect(selectedServices[0]);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="text-center py-12">
//           <p className="text-gray-400">Loading services...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
//           <Scissors className="w-8 h-8 text-orange-400" />
//         </div>
//         <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//           Select Service
//         </h3>
//         <p className="text-gray-400 text-sm sm:text-base">
//           {shop?.name && (
//             <span>
//               Choose a service at <strong>{shop.name}</strong>
//             </span>
//           )}
//         </p>
//       </div>

//       {/* Error State */}
//       {error && (
//         <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
//           <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//           <p className="text-red-300 text-sm">{error}</p>
//         </div>
//       )}

//       {/* Empty State */}
//       {services.length === 0 && !error ? (
//         <div className="text-center py-12 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl">
//           <Scissors className="w-12 h-12 text-gray-600 mx-auto mb-3" />
//           <p className="text-gray-400">No services available</p>
//         </div>
//       ) : (
//         /* Services List */
//         <div className="space-y-4">
//           {services.map((service) => (
//             <div
//               key={service.id}
//               onClick={() => toggleService(service)}
//               className={`p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all select-none ${
//                 isSelected(service)
//                   ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20"
//                   : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50 hover:bg-gray-800/50"
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
//                   {/* Icon Badge */}
//                   <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Scissors className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <h4 className="text-base sm:text-lg font-bold text-white">
//                       {service.name}
//                     </h4>
//                     <p className="text-gray-400 text-xs sm:text-sm mt-1">
//                       {service.description}
//                     </p>

//                     {/* Stats */}
//                     <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm">
//                       {/* Duration */}
//                       <div className="flex items-center space-x-1 text-gray-400">
//                         <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
//                         <span>{service.duration} min</span>
//                       </div>

//                       {/* Price */}
//                       <div className="flex items-center space-x-1 text-teal-400 font-semibold">
//                         <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
//                         <span>₹{service.price}</span>
//                       </div>

//                       {/* Category */}
//                       {service.category && (
//                         <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs">
//                           {service.category}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Checkmark */}
//                 {isSelected(service) && (
//                   <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 ml-3 sm:ml-4 mt-1">
//                     <span className="text-white text-sm font-bold">✓</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Summary */}
//       {selectedServices.length > 0 && (
//         <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Selected Service</p>
//               <p className="text-white font-semibold">
//                 {selectedServices[0].name}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-gray-400 text-sm">Price</p>
//               <p className="text-teal-400 font-bold text-lg">
//                 ₹{getTotalPrice()}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Continue Button */}
//       <Button
//         onClick={handleContinue}
//         disabled={selectedServices.length === 0}
//         className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition transform hover:scale-105"
//       >
//         {selectedServices.length === 0
//           ? "Select a Service"
//           : "Continue to Time Selection"}
//       </Button>
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Scissors, Clock, IndianRupee } from "lucide-react";

// // Mock services data
// const mockServices = [
//   {
//     id: 1,
//     name: "Classic Haircut",
//     description: "Professional haircut tailored to your style",
//     price: 500,
//     duration: 30,
//     icon: "✂️",
//   },
//   {
//     id: 2,
//     name: "Beard Trim & Shave",
//     description: "Precision beard trimming and hot towel shave",
//     price: 300,
//     duration: 25,
//     icon: "🪒",
//   },
//   {
//     id: 3,
//     name: "Hair Styling",
//     description: "Complete styling with premium products",
//     price: 400,
//     duration: 20,
//     icon: "💇",
//   },
//   {
//     id: 4,
//     name: "Premium Package",
//     description: "Full service including cut, shave, and styling",
//     price: 1200,
//     duration: 60,
//     icon: "👑",
//   },
// ];

// export function ServiceSelection({ onSelect }) {
//   const [selectedServices, setSelectedServices] = useState([]);

//   const toggleService = (service) => {
//     if (selectedServices.find((s) => s.id === service.id)) {
//       // Remove service
//       setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
//     } else {
//       // Add service
//       setSelectedServices([...selectedServices, service]);
//     }
//   };

//   const isSelected = (service) =>
//     selectedServices.find((s) => s.id === service.id);

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
//           <Scissors className="w-8 h-8 text-orange-400" />
//         </div>
//         <h3 className="text-2xl font-bold text-white mb-2">Select Services</h3>
//         <p className="text-gray-400">Choose one or more services you want</p>
//       </div>

//       <div className="space-y-4">
//         {mockServices.map((service) => (
//           <div
//             key={service.id}
//             onClick={() => toggleService(service)}
//             className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
//               isSelected(service)
//                 ? "border-teal-500 bg-teal-500/10"
//                 : "border-gray-700 bg-gray-800/30 hover:border-teal-500/50"
//             }`}
//           >
//             <div className="flex items-start justify-between">
//               <div className="flex items-start space-x-4 flex-1">
//                 <span className="text-3xl">{service.icon}</span>
//                 <div>
//                   <h4 className="text-lg font-bold text-white">{service.name}</h4>
//                   <p className="text-gray-400 text-sm">{service.description}</p>
//                   <div className="flex items-center space-x-4 mt-3 text-sm">
//                     <div className="flex items-center space-x-1 text-gray-400">
//                       <Clock className="w-4 h-4" />
//                       <span>{service.duration} min</span>
//                     </div>
//                     <div className="flex items-center space-x-1 text-teal-400 font-semibold">
//                       <IndianRupee className="w-4 h-4" />
//                       <span>₹{service.price}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {isSelected(service) && (
//                 <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 ml-4 mt-1">
//                   <span className="text-white text-sm font-bold">✓</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <Button
//         onClick={() => selectedServices.length > 0 && onSelect(selectedServices)}
//         disabled={selectedServices.length === 0}
//         className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-black font-semibold rounded-lg"
//       >
//         Continue to Time Selection
//       </Button>
//     </div>
//   );
// }
