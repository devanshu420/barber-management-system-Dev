// hooks/useLocation.js
import { useState, useCallback } from "react";

const NOMINATIM_API = "https://nominatim.openstreetmap.org/reverse";

/**
 * Custom hook for geolocation and reverse geocoding
 * Handles GPS fetching and address lookup via Nominatim
 */
export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Reverse geocode coordinates to get address
   */
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${NOMINATIM_API}?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      const address = data.address || {};

      // Extract city/town
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        "Unknown";

      // Format address
      const formattedAddress =
        data.name ||
        data.display_name?.split(",").slice(0, 3).join(",").trim() ||
        `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      return {
        address: formattedAddress,
        city: city,
        latitude,
        longitude,
      };
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      // Fallback to coordinates
      return {
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: "Unknown",
        latitude,
        longitude,
      };
    }
  }, []);

  /**
   * Get user's current GPS location
   */
  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              // Reverse geocode to get address
              const locationData = await reverseGeocode(latitude, longitude);
              setLoading(false);
              resolve(locationData);
            } catch (geocodeError) {
              setError("Failed to get address");
              setLoading(false);
              reject(geocodeError);
            }
          },
          (err) => {
            let errorMsg = "Failed to get location";

            if (err.code === 1) {
              errorMsg =
                "Permission denied. Please enable location access in your browser settings.";
            } else if (err.code === 2) {
              errorMsg = "Position unavailable. Please try again.";
            } else if (err.code === 3) {
              errorMsg = "Request timeout. Please try again.";
            }

            setError(errorMsg);
            setLoading(false);
            reject(new Error(errorMsg));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    } catch (err) {
      setError(err.message || "Failed to get location");
      setLoading(false);
      throw err;
    }
  }, [reverseGeocode]);

  /**
   * Geocode address string to coordinates
   */
  const geocodeAddress = useCallback(async (addressString) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("Address not found");
      }

      const result = data[0];
      const latitude = parseFloat(result.lat);
      const longitude = parseFloat(result.lon);

      const locationData = await reverseGeocode(latitude, longitude);
      setLoading(false);
      return locationData;
    } catch (err) {
      setError(err.message || "Failed to geocode address");
      setLoading(false);
      throw err;
    }
  }, [reverseGeocode]);

  return {
    loading,
    error,
    getCurrentLocation,
    geocodeAddress,
    reverseGeocode,
    setError,
  };
};