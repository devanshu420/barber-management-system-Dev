"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationSelection } from "./steps/LocationStep";
import { ShopSelection } from "./steps/ShopStep";
import { ServiceSelection } from "./steps/ServiceStep";
import { TimeSelection } from "./steps/TimeStep";
import { BookingConfirmation } from "./steps/ConfirmationStep";

// Futuristic Animated Cursor
function FuturisticCursor() {
  const [, setRerender] = useState(0);
  const [hovering, setHovering] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let frame;
    function animate() {
      trail.current.x += (mouse.current.x - trail.current.x) * 0.28;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.28;
      setRerender((v) => v + 1);
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    const set = () => setHovering(true);
    const unset = () => setHovering(false);
    const nodes = document.querySelectorAll(
      "button,a,[tabindex]:not([tabindex='-1']),input,label"
    );
    nodes.forEach((n) => {
      n.addEventListener("mouseenter", set);
      n.addEventListener("mouseleave", unset);
    });
    return () =>
      nodes.forEach((n) => {
        n.removeEventListener("mouseenter", set);
        n.removeEventListener("mouseleave", unset);
      });
  }, []);

  useEffect(() => {
    document.body.classList.add("cursor-none");
    return () => document.body.classList.remove("cursor-none");
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 z-[10000] pointer-events-none mix-blend-screen"
        style={{
          transform: `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%) scale(${hovering ? 1.8 : 1})`,
          transition: "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className={`w-4 h-4 rounded-full border-2 ${hovering ? "border-cyan-300 bg-cyan-200/25 animate-pulse" : "border-cyan-500 bg-cyan-400/20"} transition-all duration-200`}
          style={{
            boxShadow: hovering
              ? "0 0 30px 8px rgba(34,211,238,0.7),0 0 50px 20px rgba(34,211,238,0.2)"
              : "0 0 16px 5px rgba(34,211,238,0.55)",
          }}
        />
      </div>
      <div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-screen"
        style={{
          transform: `translate(${trail.current.x}px,${trail.current.y}px) translate(-50%,-50%)`,
        }}
      >
        <div className="w-14 h-14 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>
    </>
  );
}

// Step Progress Indicator
function StepProgress({ currentStep, steps }) {
  const stepIndex = steps.indexOf(currentStep);
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                idx <= stepIndex
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-lg shadow-cyan-500/50"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {idx + 1}
            </motion.div>
            {idx < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`flex-1 h-1 mx-2 ${
                  idx < stepIndex
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500"
                    : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-gray-400 text-sm mt-4 capitalize">
        Step {stepIndex + 1}: {currentStep.replace(/_/g, " ")}
      </p>
    </div>
  );
}

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState("location");
  const [bookingData, setBookingData] = useState({});
  const steps = ["location", "shop", "service", "time", "confirmation"];

  const handleStepComplete = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const handleLocationSelect = (userLocation) => {
    handleStepComplete({ userLocation });
    setCurrentStep("shop");
  };

  const handleShopSelect = (shop) => {
    handleStepComplete({ shop });
    setCurrentStep("service");
  };

  const handleServiceSelect = (service) => {
    handleStepComplete({ service });
    setCurrentStep("time");
  };

  const handleTimeSelect = (date, time) => {
    handleStepComplete({ date, time });
    setCurrentStep("confirmation");
  };

  const handleBack = () => {
    const currentIdx = steps.indexOf(currentStep);
    if (currentIdx > 0) {
      setCurrentStep(steps[currentIdx - 1]);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <FuturisticCursor />

      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Book Your Appointment
          </h1>
          <p className="text-gray-300 text-lg">
            Schedule your perfect barber appointment in minutes
          </p>
        </motion.div>

        {/* Step Progress */}
        <StepProgress currentStep={currentStep} steps={steps} />

        {/* Main Content Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-900/60 backdrop-blur-md border border-gray-800/50 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 pointer-events-none" />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {currentStep === "location" && (
                <LocationSelection key="location" onSelect={handleLocationSelect} />
              )}

              {currentStep === "shop" && (
                <ShopSelection
                  key="shop"
                  userLocation={bookingData.userLocation}
                  onSelect={handleShopSelect}
                />
              )}

              {currentStep === "service" && bookingData.shop && (
                <ServiceSelection
                  key="service"
                  shop={bookingData.shop}
                  onSelect={handleServiceSelect}
                />
              )}

              {currentStep === "time" && bookingData.shop && (
                <TimeSelection
                  key="time"
                  shop={bookingData.shop}
                  serviceDuration={bookingData.service?.duration}
                  onSelect={handleTimeSelect}
                />
              )}

              {currentStep === "confirmation" && (
                <BookingConfirmation
                  key="confirmation"
                  bookingData={bookingData}
                  onBack={handleBack}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Back Button */}
        {currentStep !== "location" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleBack}
            className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
          >
            ← Go Back
          </motion.button>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { font-family: "Poppins", sans-serif; }
        body, .cursor-none, .cursor-none * { cursor: none !important; }
      `}</style>
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
