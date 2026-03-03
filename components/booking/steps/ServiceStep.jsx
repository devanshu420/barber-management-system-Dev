"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  Clock,
  IndianRupee,
  AlertCircle,
  Loader,
} from "lucide-react";
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
          `http://localhost:5000/api/barbers/shops/${shopId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const shopData = response.data.data;
          const fetchedServices = shopData.services || [];

          if (fetchedServices.length === 0) {
            setError("No services available for this barbershop.");
            setLoading(false);
            return;
          }

          const transformedServices = fetchedServices.map((service) => ({
            _id: service._id,
            name: service.name,
            description: service.description || "Professional service",
            price: service.price,
            duration: service.duration,
            category: service.category || "General",
          }));

          setServices(transformedServices);
        } else {
          setError(
            response.data.message || "Failed to fetch shop services."
          );
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

  const isSelected = (service) =>
    selectedServices.find((s) => s._id === service._id);

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
        <p className="text-gray-300 text-sm sm:text-base">
          Loading services...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 sm:mb-6"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500/30 via-amber-500/25 to-yellow-500/25 rounded-2xl mb-4 border border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.5)]">
          <Scissors className="w-7 h-7 sm:w-8 sm:h-8 text-orange-200" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Pick your style
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
          {shop?.name ? (
            <>
              Choose a service at{" "}
              <span className="text-teal-300 font-medium">{shop.name}</span>
            </>
          ) : (
            "Select one service to continue with your booking."
          )}
        </p>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs sm:text-sm">{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
      {services.length === 0 && !error && (
        <div className="text-center py-10 px-4 bg-gray-900/70 border border-gray-800/80 rounded-2xl">
          <Scissors className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 text-sm sm:text-base mb-1">
            No services available right now.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            Please try another barbershop or check back later.
          </p>
        </div>
      )}

      {/* Services List */}
      {services.length > 0 && (
        <div className="space-y-4">
          {services.map((service, idx) => (
            <motion.button
              type="button"
              key={service._id || `service_${idx}`}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleService(service)}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all group relative overflow-hidden ${
                isSelected(service)
                  ? "border-teal-400 bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-cyan-500/10 shadow-[0_16px_40px_rgba(45,212,191,0.6)]"
                  : "border-gray-800 bg-gray-900/70 hover:border-teal-400/70 hover:bg-gray-900/90 shadow-[0_12px_30px_rgba(0,0,0,0.75)]"
              }`}
            >
              {/* Top accent line */}
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Icon Badge */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/15 rounded-xl flex items-center justify-center shrink-0 border border-orange-400/30">
                    <Scissors className="w-6 h-6 sm:w-7 sm:h-7 text-orange-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-teal-300 transition-colors truncate">
                      {service.name}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>{service.duration} min</span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        {/* <IndianRupee className="w-4 h-4 shrink-0" /> */}
                        <span>₹{service.price}</span>
                      </div>

                      {service.category && (
                        <span className="px-2 py-1 bg-gray-800/70 text-gray-300 rounded-full text-[11px]">
                          {service.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkmark */}
                {isSelected(service) && (
                  <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-[0_0_16px_rgba(45,212,191,0.8)]">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>

              {/* Bottom hint */}
              <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                <span>
                  {isSelected(service)
                    ? "Selected service"
                    : "Tap to select this service"}
                </span>
                <span className="text-teal-300 group-hover:text-teal-200">
                  Continue →
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Summary */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 bg-emerald-500/10 border border-emerald-500/35 rounded-2xl flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Selected service
            </p>
            <p className="text-white font-semibold text-sm sm:text-base">
              {selectedServices[0].name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs sm:text-sm">Total</p>
            <p className="text-emerald-400 font-bold text-lg">
              ₹{getTotalPrice()}
            </p>
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.button
        whileHover={selectedServices.length ? { scale: 1.03 } : {}}
        whileTap={selectedServices.length ? { scale: 0.97 } : {}}
        onClick={handleContinue}
        disabled={selectedServices.length === 0}
        className="w-full py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 hover:from-teal-400 hover:via-cyan-400 hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-2xl transition-transform duration-150 shadow-[0_18px_45px_rgba(56,189,248,0.65)] text-sm sm:text-base"
      >
        {selectedServices.length === 0
          ? "Select a service to continue"
          : "Continue to time selection"}
      </motion.button>
    </div>
  );
}
