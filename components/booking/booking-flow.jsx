
"use client";

import { useState } from "react";
import { LocationSelection } from "./steps/LocationStep";
import { ShopSelection } from "./steps/ShopStep";
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
    console.log("Shop selected:", shop); // Debug
    handleStepComplete({ shop });
    setCurrentStep("service");
  };

  const handleServiceSelect = (service) => {
    console.log("Service selected:", service); // Debug
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
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Book Your Appointment
          </h1>
          <p className="text-gray-400 text-lg">
            Schedule your perfect barber appointment
          </p>
        </div>

        {/* Main Content */}
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

          {currentStep === "service" && bookingData.shop && (
            <ServiceSelection
              shop={bookingData.shop}
              onSelect={handleServiceSelect}
            />
          )}

          {/* {currentStep === "time" && (
            <TimeSelection
              serviceDuration={bookingData.service?.duration}
              onSelect={handleTimeSelect}
            />
          )} */}
          
          {currentStep === "time" && bookingData.shop && (
            <TimeSelection
              shop={bookingData.shop}
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
// import { LocationSelection } from "./steps/LocationStep";
// import { ShopSelection } from "./steps/ShopStep";
// // import { BarberSelection } from "./steps/BarberStep";  // Removed barber step
// import { ServiceSelection } from "./steps/ServiceStep";
// import { TimeSelection } from "./steps/TimeStep";
// import { BookingConfirmation } from "./steps/ConfirmationStep";

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
//     // Skip barber step, go directly to service
//     setCurrentStep("service");
//   };

//   // Barber selection removed

//   const handleServiceSelect = (service) => {
//     handleStepComplete({ service });
//     setCurrentStep("time");
//   };

//   const handleTimeSelect = (date, time) => {
//     handleStepComplete({ date, time });
//     setCurrentStep("confirmation");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto py-12">
//         {/* 🔹 Header */}
//         <div className="mb-12 text-center">
//           <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
//             Book Your Appointment
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Schedule your perfect barber appointment
//           </p>
//         </div>

//         {/* 🔹 Main Content */}
//         <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 sm:p-12 shadow-lg">

//           {currentStep === "location" && (
//             <LocationSelection onSelect={handleLocationSelect} />
//           )}

//           {currentStep === "shop" && (
//             <ShopSelection
//               userLocation={bookingData.userLocation}
//               onSelect={handleShopSelect}
//             />
//           )}

//           {currentStep === "service" && (
//             <ServiceSelection onSelect={handleServiceSelect} />
//           )}

//           {currentStep === "time" && (
//             <TimeSelection
//               serviceDuration={bookingData.service?.duration}
//               onSelect={handleTimeSelect}
//             />
//           )}

//           {currentStep === "confirmation" && (
//             <BookingConfirmation bookingData={bookingData} />
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }
