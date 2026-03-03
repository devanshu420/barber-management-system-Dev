"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationSelection } from "./steps/LocationStep";
import { ShopSelection } from "./steps/ShopStep";
import { ServiceSelection } from "./steps/ServiceStep";
import { TimeSelection } from "./steps/TimeStep";
import BookingConfirmation from "./steps/ConfirmationStep";

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
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          transform: `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%) scale(${
            hovering ? 1.8 : 1
          })`,
          transition: "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            hovering
              ? "border-cyan-300 bg-cyan-200/25 animate-pulse"
              : "border-cyan-500 bg-cyan-400/20"
          } transition-all duration-200`}
          style={{
            boxShadow: hovering
              ? "0 0 30px 8px rgba(34,211,238,0.7),0 0 50px 20px rgba(34,211,238,0.2)"
              : "0 0 16px 5px rgba(34,211,238,0.55)",
          }}
        />
      </div>
      <div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
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
    <div className="mb-10 sm:mb-12">
      <div className="flex justify-between items-center gap-2">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${
                idx <= stepIndex
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-lg shadow-cyan-500/40"
                  : "bg-gray-800 text-gray-500 border border-gray-700"
              }`}
            >
              {idx + 1}
            </motion.div>
            {idx < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`hidden sm:block flex-1 h-1 mx-2 rounded-full ${
                  idx < stepIndex
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500"
                    : "bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-gray-400 text-xs sm:text-sm mt-4 capitalize">
        Step {stepIndex + 1} of {steps.length} ·{" "}
        <span className="text-cyan-300">
          {currentStep.replace(/_/g, " ")}
        </span>
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
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-cyan-950 text-white overflow-hidden py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <FuturisticCursor />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] right-[15%] w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/18 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[10%] w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/14 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-cyan-950/85" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs text-cyan-200 font-medium">
              Smart, step-by-step barber booking
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Book your appointment
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
            Choose your location, barber, service, and time slot in a smooth,
            guided flow designed for speed and clarity.
          </p>
        </motion.div>

        {/* Step Progress */}
        <StepProgress currentStep={currentStep} steps={steps} />

        {/* Main Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.99 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative bg-gray-900/70 backdrop-blur-xl border border-gray-800/70 rounded-3xl px-5 sm:px-8 py-6 sm:py-8 shadow-[0_22px_60px_rgba(0,0,0,0.85)] overflow-hidden"
          >
            {/* Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/6 via-transparent to-teal-500/8" />

            <div className="relative z-10">
              {currentStep === "location" && (
                <LocationSelection
                  key="location"
                  onSelect={handleLocationSelect}
                />
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
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Back Button */}
        {currentStep !== "location" && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleBack}
            className="mt-5 text-cyan-300 hover:text-cyan-200 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <span className="text-base">←</span>
            Back to previous step
          </motion.button>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          * { font-family: "Poppins", sans-serif; }
          body, .cursor-none, .cursor-none * { cursor: none !important; }
        `,
        }}
      />
    </div>
  );
}
