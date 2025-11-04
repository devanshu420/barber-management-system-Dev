"use client";

import { useState } from "react";
import { LocationSelection } from "./steps/LocationStep";
import { ShopSelection } from "./steps/ShopStep";
// import { BarberSelection } from "./steps/BarberStep";  // Removed barber step
import { ServiceSelection } from "./steps/ServiceStep";
import { TimeSelection } from "./steps/TimeStep";
import { BookingConfirmation } from "./steps/ConfirmationStep";

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState("location");
  const [bookingData, setBookingData] = useState({});

  const handleStepComplete = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const handleLocationSelect = (userLocation) => {
    handleStepComplete({ userLocation });
    setCurrentStep("shop");
  };

  const handleShopSelect = (shop) => {
    handleStepComplete({ shop });
    // Skip barber step, go directly to service
    setCurrentStep("service");
  };

  // Barber selection removed

  const handleServiceSelect = (service) => {
    handleStepComplete({ service });
    setCurrentStep("time");
  };

  const handleTimeSelect = (date, time) => {
    handleStepComplete({ date, time });
    setCurrentStep("confirmation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-12">
        {/* 🔹 Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Book Your Appointment
          </h1>
          <p className="text-gray-400 text-lg">
            Schedule your perfect barber appointment
          </p>
        </div>

        {/* 🔹 Main Content */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 sm:p-12 shadow-lg">

          {currentStep === "location" && (
            <LocationSelection onSelect={handleLocationSelect} />
          )}

          {currentStep === "shop" && (
            <ShopSelection
              userLocation={bookingData.userLocation}
              onSelect={handleShopSelect}
            />
          )}

          {currentStep === "service" && (
            <ServiceSelection onSelect={handleServiceSelect} />
          )}

          {currentStep === "time" && (
            <TimeSelection
              serviceDuration={bookingData.service?.duration}
              onSelect={handleTimeSelect}
            />
          )}

          {currentStep === "confirmation" && (
            <BookingConfirmation bookingData={bookingData} />
          )}

        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { LocationSelection } from "./location-selection";
// import { ShopSelection } from "./shop-selection";
// import { BarberSelection } from "./barber-selection";
// import { ServiceSelection } from "./service-selection";
// import { TimeSelection } from "./time-selection";
// import { BookingConfirmation } from "./booking-confirmation";
// import { CheckSquare } from "lucide-react";

// export function BookingFlow() {
//   const [currentStep, setCurrentStep] = useState("location");
//   const [bookingData, setBookingData] = useState({});

//   const handleStepComplete = (data) => {
//     setBookingData((prev) => ({ ...prev, ...data }));
//   };

//   const handleLocationSelect = (userLocation) => {
//     handleStepComplete({ userLocation });
//     setCurrentStep("shop");
//   };

//   const handleShopSelect = (shop) => {
//     handleStepComplete({ shop });
//     setCurrentStep("barber");
//   };

//   const handleBarberSelect = (barber) => {
//     handleStepComplete({ barber });
//     setCurrentStep("service");
//   };

//   const handleServiceSelect = (service) => {
//     handleStepComplete({ service });
//     setCurrentStep("time");
//   };

//   const handleTimeSelect = (date, time) => {
//     handleStepComplete({ date, time });
//     setCurrentStep("confirmation");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* 🔹 Header */}
//         <div className="mb-12 text-center">
//           <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Book Your Appointment</h1>
//           <p className="text-gray-400 text-lg">Schedule your perfect barber appointment</p>
//         </div>

//         {/* 🔹 Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: Step Content */}
//           <div className="lg:col-span-2">
//             <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-lg">
//               {currentStep === "location" && (
//                 <LocationSelection onSelect={handleLocationSelect} />
//               )}

//               {currentStep === "shop" && (
//                 <ShopSelection
//                   userLocation={bookingData.userLocation}
//                   onSelect={handleShopSelect}
//                 />
//               )}

//               {currentStep === "barber" && (
//                 <BarberSelection onSelect={handleBarberSelect} />
//               )}

//               {currentStep === "service" && (
//                 <ServiceSelection onSelect={handleServiceSelect} />
//               )}

//               {currentStep === "time" && (
//                 <TimeSelection
//                   serviceDuration={bookingData.service?.duration}
//                   onSelect={handleTimeSelect}
//                 />
//               )}

//               {currentStep === "confirmation" && (
//                 <BookingConfirmation bookingData={bookingData} />
//               )}
//             </div>
//           </div>

//           {/* Right: Booking Summary Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-4 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg">
//               <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
//                   <CheckSquare className="w-5 h-5 text-teal-400" />
//                 </div>
//                 <span>Booking Summary</span>
//               </h3>

//               <div className="space-y-6">
//                 {/* Location */}
//                 {bookingData.userLocation && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-1">📍 Location</p>
//                     <p className="text-white font-medium">{bookingData.userLocation.address || "Location enabled"}</p>
//                   </div>
//                 )}

//                 {/* Shop */}
//                 {bookingData.shop && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-3">🏪 Barbershop</p>
//                     <div className="flex items-start space-x-3">
//                       <img
//                         src={bookingData.shop.image || "/placeholder.svg"}
//                         alt={bookingData.shop.name}
//                         className="w-10 h-10 rounded-lg object-cover"
//                       />
//                       <div>
//                         <p className="text-white font-semibold">{bookingData.shop.name}</p>
//                         <p className="text-gray-400 text-sm">{bookingData.shop.distance?.toFixed(1)} km away</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Barber */}
//                 {bookingData.barber && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-3">👨‍💼 Barber</p>
//                     <div className="flex items-start space-x-3">
//                       <img
//                         src={bookingData.barber.image || "/placeholder.svg"}
//                         alt={bookingData.barber.name}
//                         className="w-10 h-10 rounded-lg object-cover"
//                       />
//                       <div>
//                         <p className="text-white font-semibold">{bookingData.barber.name}</p>
//                         <p className="text-gray-400 text-sm">⭐ {bookingData.barber.rating} rating</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Service */}
//                 {bookingData.service && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-3">✂️ Service</p>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-white font-semibold">{bookingData.service.name}</p>
//                         <p className="text-gray-400 text-sm">{bookingData.service.duration} minutes</p>
//                       </div>
//                       <span className="bg-teal-500/20 text-teal-300 border border-teal-500/50 px-2 py-1 rounded text-sm">
//                         ₹{bookingData.service.price}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Date & Time */}
//                 {bookingData.date && bookingData.time && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-2">📅 Date & Time</p>
//                     <p className="text-white font-semibold">
//                       {new Date(bookingData.date).toLocaleDateString("en-US", {
//                         weekday: "long",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </p>
//                     <p className="text-gray-400 text-sm">{bookingData.time}</p>
//                   </div>
//                 )}

//                 {/* Total Price */}
//                 {bookingData.service && (
//                   <div className="p-4 bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-lg">
//                     <div className="flex justify-between items-center">
//                       <p className="text-gray-400 font-medium">Total Amount</p>
//                       <p className="text-2xl font-bold text-teal-400">₹{bookingData.service.price}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




































// "use client";

// import { useState } from "react";
// import { LocationSelection } from "./location-selection";
// import { ShopSelection } from "./shop-selection";
// import { BarberSelection } from "./barber-selection";
// import { ServiceSelection } from "./service-selection";
// import { TimeSelection } from "./time-selection";
// import { BookingConfirmation } from "./booking-confirmation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle, MapPin, Building2, User, Scissors, Calendar, CheckSquare } from "lucide-react";

// const steps = [
//   { id: "location", title: "Your Location", description: "Enable location", icon: MapPin },
//   { id: "shop", title: "Choose Shop", description: "Select barbershop", icon: Building2 },
//   { id: "barber", title: "Choose Barber", description: "Pick barber", icon: User },
//   { id: "service", title: "Select Service", description: "Choose service", icon: Scissors },
//   { id: "time", title: "Select Time", description: "Pick date & time", icon: Calendar },
//   { id: "confirmation", title: "Confirm", description: "Review booking", icon: CheckSquare },
// ];

// export function BookingFlow() {
//   const [currentStep, setCurrentStep] = useState("location");
//   const [bookingData, setBookingData] = useState({});

//   const handleStepComplete = (step, data) => {
//     setBookingData((prev) => ({ ...prev, ...data }));

//     const stepIndex = steps.findIndex((s) => s.id === step);
//     if (stepIndex < steps.length - 1) {
//       setCurrentStep(steps[stepIndex + 1].id);
//     }
//   };

//   const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* 🔹 Header */}
//         <div className="mb-12 text-center">
//           <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Book Your Appointment</h1>
//           <p className="text-gray-400 text-lg">Follow the steps below to schedule your barber appointment</p>
//         </div>

//         {/* 🔹 Progress Steps */}
//         <div className="mb-12 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8">
//           <div className="flex items-center justify-between overflow-x-auto pb-4 sm:pb-0">
//             {steps.map((step, index) => {
//               const isActive = step.id === currentStep;
//               const isCompleted = getCurrentStepIndex() > index;
//               const IconComponent = step.icon;

//               return (
//                 <div key={step.id} className="flex items-center flex-shrink-0">
//                   {/* Step Circle */}
//                   <div className="flex flex-col items-center">
//                     <div
//                       className={`w-14 h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
//                         isCompleted
//                           ? "bg-green-500/20 border-2 border-green-500 text-green-400"
//                           : isActive
//                           ? "bg-gradient-to-r from-teal-500 to-teal-600 border-2 border-teal-400 text-white shadow-lg scale-110"
//                           : "bg-gray-800 border-2 border-gray-700 text-gray-500"
//                       }`}
//                     >
//                       {isCompleted ? (
//                         <CheckCircle className="w-6 h-6" />
//                       ) : (
//                         <IconComponent className="w-6 h-6" />
//                       )}
//                     </div>
//                     <div className="mt-3 text-center hidden sm:block">
//                       <p className={`text-sm font-semibold ${isActive ? "text-teal-400" : "text-gray-400"}`}>
//                         {step.title}
//                       </p>
//                       <p className="text-xs text-gray-500">{step.description}</p>
//                     </div>
//                   </div>

//                   {/* Connector Line */}
//                   {index < steps.length - 1 && (
//                     <div
//                       className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
//                         getCurrentStepIndex() > index
//                           ? "bg-gradient-to-r from-green-500 to-teal-500"
//                           : "bg-gray-700"
//                       }`}
//                       style={{ minWidth: "20px" }}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* 🔹 Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: Step Content */}
//           <div className="lg:col-span-2">
//             <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-lg">
//               <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
//                   {(() => {
//                     const step = steps.find((s) => s.id === currentStep);
//                     const IconComponent = step.icon;
//                     return (
//                       <>
//                         <IconComponent className="w-6 h-6 text-teal-400" />
//                         <span>{step.title}</span>
//                       </>
//                     );
//                   })()}
//                 </h2>
//                 <p className="text-gray-400 text-sm mt-2">
//                   {steps.find((s) => s.id === currentStep).description}
//                 </p>
//               </div>

//               <div className="border-t border-gray-800 pt-8">
//                 {currentStep === "location" && (
//                   <LocationSelection
//                     onSelect={(userLocation) => handleStepComplete("location", { userLocation })}
//                   />
//                 )}

//                 {currentStep === "shop" && (
//                   <ShopSelection
//                     userLocation={bookingData.userLocation}
//                     onSelect={(shop) => handleStepComplete("shop", { shop })}
//                   />
//                 )}

//                 {currentStep === "barber" && (
//                   <BarberSelection
//                     locationId={bookingData.shop?.id}
//                     onSelect={(barber) => handleStepComplete("barber", { barber })}
//                   />
//                 )}

//                 {currentStep === "service" && (
//                   <ServiceSelection onSelect={(service) => handleStepComplete("service", { service })} />
//                 )}

//                 {currentStep === "time" && (
//                   <TimeSelection
//                     barberId={bookingData.barber?.id}
//                     serviceDuration={bookingData.service?.duration}
//                     onSelect={(date, time) => handleStepComplete("time", { date, time })}
//                   />
//                 )}

//                 {currentStep === "confirmation" && (
//                   <BookingConfirmation bookingData={bookingData} />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right: Booking Summary Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-4 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg">
//               <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
//                   <CheckSquare className="w-5 h-5 text-teal-400" />
//                 </div>
//                 <span>Booking Summary</span>
//               </h3>

//               <div className="space-y-6">
//                 {/* Location */}
//                 {bookingData.userLocation && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-1">📍 Location</p>
//                     <p className="text-white font-medium">{bookingData.userLocation.address || "Location enabled"}</p>
//                   </div>
//                 )}

//                 {/* Shop */}
//                 {bookingData.shop && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-3">🏪 Barbershop</p>
//                     <div className="flex items-start space-x-3">
//                       <img
//                         src={bookingData.shop.image || "/placeholder.svg"}
//                         alt={bookingData.shop.name}
//                         className="w-10 h-10 rounded-lg object-cover"
//                       />
//                       <div>
//                         <p className="text-white font-semibold">{bookingData.shop.name}</p>
//                         <p className="text-gray-400 text-sm">{bookingData.shop.distance?.toFixed(1)} km away</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Barber */}
//                 {bookingData.barber && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-3">👨‍💼 Barber</p>
//                     <div className="flex items-start space-x-3">
//                       <img
//                         src={bookingData.barber.image || "/placeholder.svg"}
//                         alt={bookingData.barber.name}
//                         className="w-10 h-10 rounded-lg object-cover"
//                       />
//                       <div>
//                         <p className="text-white font-semibold">{bookingData.barber.name}</p>
//                         <p className="text-gray-400 text-sm">⭐ {bookingData.barber.rating} rating</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Service */}
//                 {bookingData.service && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-3">✂️ Service</p>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-white font-semibold">{bookingData.service.name}</p>
//                         <p className="text-gray-400 text-sm">{bookingData.service.duration} minutes</p>
//                       </div>
//                       <Badge className="bg-teal-500/20 text-teal-300 border border-teal-500/50">
//                         ₹{bookingData.service.price}
//                       </Badge>
//                     </div>
//                   </div>
//                 )}

//                 {/* Date & Time */}
//                 {bookingData.date && bookingData.time && (
//                   <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
//                     <p className="text-teal-400 text-sm font-semibold mb-2">📅 Date & Time</p>
//                     <p className="text-white font-semibold">
//                       {new Date(bookingData.date).toLocaleDateString("en-US", {
//                         weekday: "long",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </p>
//                     <p className="text-gray-400 text-sm">{bookingData.time}</p>
//                   </div>
//                 )}

//                 {/* Total Price */}
//                 {bookingData.service && (
//                   <div className="p-4 bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-lg">
//                     <div className="flex justify-between items-center">
//                       <p className="text-gray-400 font-medium">Total Amount</p>
//                       <p className="text-2xl font-bold text-teal-400">₹{bookingData.service.price}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Progress Info */}
//                 <div className="pt-4 border-t border-gray-700">
//                   <p className="text-gray-500 text-xs text-center">
//                     Step {getCurrentStepIndex() + 1} of {steps.length}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideUp {
//           0% {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-slideUp {
//           animation: slideUp 0.6s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }