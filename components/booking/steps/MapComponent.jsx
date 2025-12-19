"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Leaflet Map Component
 * - Initializes map with OpenStreetMap tiles
 * - Handles marker placement and updates
 * - Supports click-to-select and animations
 * - Proper cleanup to prevent memory leaks
 */
function MapComponent({ location, onMapClick, height = "400px" }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Fix default Leaflet icon issue
  const defaultIcon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const highlightIcon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [32, 45],
    iconAnchor: [16, 45],
    popupAnchor: [1, -40],
    shadowSize: [41, 41],
  });

  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const defaultCenter = [28.6139, 77.209]; // India - Default center

      // Create map instance
      map.current = L.map(mapContainer.current, {
        attributionControl: true,
        zoomControl: true,
      }).setView(defaultCenter, 12);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        minZoom: 2,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.current);

      // Add click event listener for map
      if (onMapClick) {
        map.current.on("click", (e) => {
          const { lat, lng } = e.latlng;
          onMapClick({ latitude: lat, longitude: lng });
        });
      }

      setIsMapReady(true);

      // Cleanup function
      return () => {
        if (map.current) {
          map.current.off();
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [onMapClick]);

  // Update marker when location changes
  useEffect(() => {
    if (!map.current || !isMapReady || !location) return;

    try {
      const { latitude, longitude, address } = location;
      const position = [latitude, longitude];

      // Remove existing marker
      if (markerRef.current) {
        map.current.removeLayer(markerRef.current);
      }

      // Create popup content with better formatting
      const popupContent = `
        <div class="p-2 text-sm">
          <div class="font-bold text-cyan-600 mb-1">${address || "Selected Location"}</div>
          <div class="text-gray-700 text-xs">
            <div>Lat: ${latitude.toFixed(6)}</div>
            <div>Lon: ${longitude.toFixed(6)}</div>
          </div>
        </div>
      `;

      // Add new marker
      markerRef.current = L.marker(position, { icon: highlightIcon })
        .addTo(map.current)
        .bindPopup(popupContent, {
          maxWidth: 250,
          closeButton: true,
        })
        .openPopup();

      // Smooth animation to location
      map.current.flyTo(position, 16, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    } catch (error) {
      console.error("Error updating marker:", error);
    }
  }, [location, isMapReady]);

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-lg overflow-hidden bg-gray-700"
      style={{
        height,
        minHeight: "300px",
      }}
    >
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-300 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapComponent;