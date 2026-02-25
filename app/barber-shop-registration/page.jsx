
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Building2,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Navigation,
  X,
  Loader,
} from "lucide-react";

export default function BarberRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FORM STATE
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    image: null,
    services: [{ name: "", price: "", duration: "", category: "haircut" }],
    workingHours: {
      monday: { start: "09:00", end: "18:00", isOpen: true },
      tuesday: { start: "09:00", end: "18:00", isOpen: true },
      wednesday: { start: "09:00", end: "18:00", isOpen: true },
      thursday: { start: "09:00", end: "18:00", isOpen: true },
      friday: { start: "09:00", end: "18:00", isOpen: true },
      saturday: { start: "10:00", end: "16:00", isOpen: true },
      sunday: { start: "", end: "", isOpen: false },
    },
    staff: [{ name: "", role: "", phone: "", specialization: "" }],
  });

  const [imagePreview, setImagePreview] = useState(null);

  // HANDLERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(`${file.name} is not a valid image file`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(`${file.name} is too large (max 5MB)`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleFetchCoordinates = () => {
    setFetchingLocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setFetchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));
        setFetchingLocation(false);
      },
      (error) => {
        let errorMessage = "Failed to fetch coordinates";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            "Location permission denied. Please enable location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out";
        }
        setError(errorMessage);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index][field] = value;
    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: "", price: "", duration: "", category: "haircut" },
      ],
    }));
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  // HELPERS
  function cleanWorkingHours(hours) {
    const cleaned = {};
    Object.entries(hours).forEach(([day, data]) => {
      cleaned[day] = {
        isOpen: Boolean(data.isOpen),
        start: data.start || "",
        end: data.end || "",
      };
    });
    return cleaned;
  }

  function cleanStaff(staffArr) {
    return staffArr
      .filter((s) => s.name && s.name.trim())
      .map((s) => ({
        name: s.name,
        role: s.role || "other",
        phone: s.phone || "",
        specialization: s.specialization ? [s.specialization] : [],
      }));
  }

  const handleWorkingHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleStaffChange = (index, field, value) => {
    const newStaff = [...formData.staff];
    newStaff[index][field] = value;
    setFormData((prev) => ({ ...prev, staff: newStaff }));
  };

  const addStaff = () => {
    setFormData((prev) => ({
      ...prev,
      staff: [
        ...prev.staff,
        { name: "", role: "", phone: "", specialization: "" },
      ],
    }));
  };

  const removeStaff = (index) => {
    setFormData((prev) => ({
      ...prev,
      staff: prev.staff.filter((_, i) => i !== index),
    }));
  };

  const validateCoordinates = () => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng)) return false;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    return true;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.shopName.trim()) {
        setError("Shop name is required");
        setLoading(false);
        return;
      }

      if (
        !formData.address.trim() ||
        !formData.city.trim() ||
        !formData.state.trim()
      ) {
        setError("Complete address is required");
        setLoading(false);
        return;
      }

      if (formData.services.length === 0 || !formData.services[0].name) {
        setError("Add at least one service");
        setLoading(false);
        return;
      }

      if (
        formData.latitude &&
        formData.longitude &&
        !validateCoordinates()
      ) {
        setError(
          "Please enter valid latitude (-90 to 90) and longitude (-180 to 180)"
        );
        setLoading(false);
        return;
      }

      const submitFormData = new FormData();

      // Basic info
      submitFormData.append("shopName", formData.shopName);
      submitFormData.append("description", formData.description);

      // IMPORTANT: build location object (backend expects location.*)
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      let coordinatesArray = [];
      if (!isNaN(lat) && !isNaN(lng)) {
        coordinatesArray = [lng, lat]; // [longitude, latitude]
      }

      const locationPayload = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode || "",
        coordinates: {
          type: "Point",
          coordinates: coordinatesArray,
        },
      };

      submitFormData.append("location", JSON.stringify(locationPayload));

      const userId = localStorage.getItem("userId");
      submitFormData.append("barberOwner", userId || "");

      if (formData.image) {
        submitFormData.append("image", formData.image);
      }

      submitFormData.append(
        "services",
        JSON.stringify(
          formData.services.map((s) => ({
            name: s.name,
            price: Number(s.price),
            duration: Number(s.duration),
            category: s.category,
            description: s.description || "",
          }))
        )
      );

      submitFormData.append(
        "workingHours",
        JSON.stringify(cleanWorkingHours(formData.workingHours))
      );

      submitFormData.append("staff", JSON.stringify(cleanStaff(formData.staff)));

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/barbers/register-shop",
        submitFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess("✅ Shop registered successfully! Redirecting...");
        setTimeout(() => router.push("/barber-shop"), 2000);
      } else {
        setError(response.data.message || "Failed to register shop");
      }
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to register shop");
    } finally {
      setLoading(false);
    }
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Register Your Barbershop
          </h1>
          <p className="text-gray-400 text-lg">
            Set up your business profile and start accepting bookings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Shop Information */}
          <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-teal-400" />
              <span>Shop Information</span>
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="text-white font-semibold mb-2 block">
                  Shop Name *
                </Label>
                <Input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="Enter shop name"
                  className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                  required
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">
                  Description
                </Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell customers about your shop"
                  rows="3"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50 rounded-lg p-3 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Image */}
          <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <ImageIcon className="w-6 h-6 text-teal-400" />
              <span>Shop Image</span>
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300 text-sm mb-2 block">
                  Upload Shop Image (Optional - One image only)
                </Label>
                <label className="w-full bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border-2 border-dashed border-teal-500/50 rounded-lg px-4 py-6 flex items-center justify-center space-x-2 transition cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                  <span>Click to select image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>

                <p className="text-gray-400 text-xs mt-2">
                  ℹ️ Supported formats: JPG, PNG, WebP | Max 5MB
                </p>
              </div>

              {imagePreview && (
                <div className="relative">
                  <div className="relative w-full max-w-sm mx-auto bg-gray-800 rounded-lg overflow-hidden aspect-square">
                    <img
                      src={imagePreview}
                      alt="Selected image"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 rounded-full p-2 transition"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg mt-3">
                    <p className="text-teal-300 text-sm">
                      ✓ Image selected: {formData.image?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Location */}
          <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-teal-400" />
              <span>Location</span>
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="text-white font-semibold mb-2 block">
                  Address *
                </Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    City *
                  </Label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    State *
                  </Label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Zip Code
                  </Label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Zip code"
                    className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Latitude
                  </Label>
                  <Input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="Latitude (-90 to 90)"
                    className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    ℹ️ e.g., 22.123456
                  </p>
                </div>
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Longitude
                  </Label>
                  <Input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="Longitude (-180 to 180)"
                    className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    ℹ️ e.g., 75.123456
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleFetchCoordinates}
                  disabled={fetchingLocation}
                  className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 text-cyan-300 font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {fetchingLocation ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>Auto-Fetch Coordinates</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Services */}
          {/* (same JSX as your original, unchanged except using handlers above) */}
          {/* ... keep your Services, Working Hours, Staff, and buttons JSX exactly as before ... */}
                    <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>💇</span>
                <span>Services</span>
              </h2>
              <Button
                type="button"
                onClick={addService}
                className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </Button>
            </div>
            <div className="space-y-4">
              {formData.services.map((service, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-700/50 bg-gray-800/20 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Service {idx + 1}</h4>
                    {formData.services.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeService(idx)}
                        className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm mb-1 block">
                        Service Name *
                      </Label>
                      <select
  value={service.name}
  onChange={(e) => handleServiceChange(idx, "name", e.target.value)}
  className="
    w-full
    bg-gray-800/60
    border border-gray-700
    text-white
    rounded-lg
    px-3 py-2.5
    text-sm
    focus:outline-none
    focus:border-teal-500
    focus:ring-1
    focus:ring-teal-500
    transition
    appearance-none
  "
  required
>
  <option value="">Select Service</option>
  <option value="haircut">Haircut</option>
  <option value="beard">Beard</option>
  <option value="styling">Styling</option>
  <option value="treatment">Treatment</option>
  <option value="wash">Wash</option>
  <option value="other">Other</option>
</select>

                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm mb-1 block">
                        Price (₹) *
                      </Label>
                      <Input
                        type="number"
                        value={service.price}
                        onChange={(e) =>
                          handleServiceChange(idx, "price", e.target.value)
                        }
                        placeholder="Price"
                        className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm mb-1 block">
                        Duration (min) *
                      </Label>
                      <Input
                        type="number"
                        value={service.duration}
                        onChange={(e) =>
                          handleServiceChange(idx, "duration", e.target.value)
                        }
                        placeholder="30"
                        className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm mb-1 block">
                        Category
                      </Label>
                      <select
                        value={service.category}
                        onChange={(e) =>
                          handleServiceChange(idx, "category", e.target.value)
                        }
                        className="w-full bg-gray-700/50 border border-gray-600 text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="haircut">Haircut</option>
                        <option value="beard">Beard</option>
                        <option value="styling">Styling</option>
                        <option value="treatment">Treatment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Working Hours */}
          <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-teal-400" />
              <span>Working Hours</span>
            </h2>
            <div className="space-y-3">
              {days.map((day) => (
                <div key={day} className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.workingHours[day].isOpen}
                      onChange={(e) =>
                        handleWorkingHoursChange(day, "isOpen", e.target.checked)
                      }
                      className="rounded border-gray-600 text-teal-500"
                    />
                    <span className="text-white font-semibold capitalize w-20">
                      {day}
                    </span>
                  </label>
                  {formData.workingHours[day].isOpen && (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        type="time"
                        value={formData.workingHours[day].start}
                        onChange={(e) =>
                          handleWorkingHoursChange(day, "start", e.target.value)
                        }
                        className="bg-gray-800/50 border border-gray-700 text-white w-24 text-sm"
                      />
                      <span className="text-gray-400">to</span>
                      <Input
                        type="time"
                        value={formData.workingHours[day].end}
                        onChange={(e) =>
                          handleWorkingHoursChange(day, "end", e.target.value)
                        }
                        className="bg-gray-800/50 border border-gray-700 text-white w-24 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Staff Members */}
          <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Staff Members</h2>
              <Button
                type="button"
                onClick={addStaff}
                className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff</span>
              </Button>
            </div>

            <div className="space-y-4">
              {formData.staff.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-700/50 bg-gray-800/20 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Staff {idx + 1}</h4>
                    {formData.staff.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeStaff(idx)}
                        className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm mb-1 block">
                        Name
                      </Label>
                      <Input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleStaffChange(idx, "name", e.target.value)
                        }
                        placeholder="Staff name"
                        className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm mb-1 block">
                        Role
                      </Label>
                     <select
  value={member.role}
  onChange={(e) => handleStaffChange(idx, "role", e.target.value)}
  className="
    w-full
    bg-gray-800/60
    border border-gray-700
    text-white
    rounded-lg
    px-3 py-2.5
    text-sm
    focus:outline-none
    focus:border-teal-500
    focus:ring-1
    focus:ring-teal-500
    transition
    appearance-none
  "
>
  <option value="">Select Role</option>
  <option value="barber">Barber</option>
  <option value="assistant">Assistant</option>
  <option value="manager">Manager</option>
  <option value="other">Other</option>
</select>


                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm mb-1 block">
                      Phone
                    </Label>
                    <Input
                      type="tel"
                      value={member.phone}
                      onChange={(e) =>
                        handleStaffChange(idx, "phone", e.target.value)
                      }
                      placeholder="Phone number"
                      className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm mb-1 block">
                      Specialization
                    </Label>
                    <Input
                      type="text"
                      value={member.specialization}
                      onChange={(e) =>
                        handleStaffChange(idx, "specialization", e.target.value)
                      }
                      placeholder="e.g., Hair Styling, Beard Trimming"
                      className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-black font-semibold rounded-lg transition"
            >
              {loading ? "Registering..." : "Register Shop"}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}



















// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   MapPin,
//   Building2,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Plus,
//   Trash2,
//   Image as ImageIcon,
//   Navigation,
//   X,
//   Loader,
// } from "lucide-react";

// export default function BarberRegistrationPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [fetchingLocation, setFetchingLocation] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ============================================
//   // FORM STATE - SINGLE IMAGE ONLY
//   // ============================================
//   const [formData, setFormData] = useState({
//     shopName: "",
//     description: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     latitude: "",
//     longitude: "",
//     image: null, // SINGLE IMAGE ONLY
//     services: [{ name: "", price: "", duration: "", category: "haircut" }],
//     workingHours: {
//       monday: { start: "09:00", end: "18:00", isOpen: true },
//       tuesday: { start: "09:00", end: "18:00", isOpen: true },
//       wednesday: { start: "09:00", end: "18:00", isOpen: true },
//       thursday: { start: "09:00", end: "18:00", isOpen: true },
//       friday: { start: "09:00", end: "18:00", isOpen: true },
//       saturday: { start: "10:00", end: "16:00", isOpen: true },
//       sunday: { start: "", end: "", isOpen: false },
//     },
//     staff: [{ name: "", role: "", phone: "", specialization: "" }],
//   });

//   // ============================================
//   // IMAGE PREVIEW - SINGLE IMAGE ONLY
//   // ============================================
//   const [imagePreview, setImagePreview] = useState(null);

//   // ============================================
//   // HANDLERS
//   // ============================================

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ============================================
//   // HANDLE SINGLE IMAGE SELECT
//   // ============================================
//   const handleImageSelect = (e) => {
//     const file = e.target.files?.[0];
//     setError("");

//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       setError(`${file.name} is not a valid image file`);
//       return;
//     }

//     // Validate file size (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       setError(`${file.name} is too large (max 5MB)`);
//       return;
//     }

//     // Set single image
//     setFormData((prev) => ({
//       ...prev,
//       image: file,
//     }));

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setImagePreview(event.target.result);
//     };
//     reader.readAsDataURL(file);

//     // Reset input
//     e.target.value = "";
//   };

//   // ============================================
//   // REMOVE IMAGE
//   // ============================================
//   const removeImage = () => {
//     setFormData((prev) => ({
//       ...prev,
//       image: null,
//     }));
//     setImagePreview(null);
//   };

//   // ============================================
//   // AUTO-FETCH COORDINATES
//   // ============================================
//   const handleFetchCoordinates = () => {
//     setFetchingLocation(true);
//     setError("");

//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       setFetchingLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setFormData((prev) => ({
//           ...prev,
//           latitude: latitude.toFixed(6),
//           longitude: longitude.toFixed(6),
//         }));
//         setFetchingLocation(false);
//         console.log("✅ Coordinates fetched successfully");
//       },
//       (error) => {
//         let errorMessage = "Failed to fetch coordinates";
//         if (error.code === error.PERMISSION_DENIED) {
//           errorMessage =
//             "Location permission denied. Please enable location access in your browser settings.";
//         } else if (error.code === error.POSITION_UNAVAILABLE) {
//           errorMessage = "Location information is unavailable";
//         } else if (error.code === error.TIMEOUT) {
//           errorMessage = "Location request timed out";
//         }
//         setError(errorMessage);
//         setFetchingLocation(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   };

//   // ============================================
//   // SERVICE HANDLERS
//   // ============================================
//   const handleServiceChange = (index, field, value) => {
//     const newServices = [...formData.services];
//     newServices[index][field] = value;
//     setFormData((prev) => ({ ...prev, services: newServices }));
//   };

//   const addService = () => {
//     setFormData((prev) => ({
//       ...prev,
//       services: [
//         ...prev.services,
//         { name: "", price: "", duration: "", category: "haircut" },
//       ],
//     }));
//   };

//   const removeService = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       services: prev.services.filter((_, i) => i !== index),
//     }));
//   };

//   // =======================
// // JSON FIX HELPERS
// // =======================
// function cleanWorkingHours(hours) {
//   const cleaned = {};
//   Object.entries(hours).forEach(([day, data]) => {
//     cleaned[day] = {
//       isOpen: Boolean(data.isOpen),
//       start: data.start || "",
//       end: data.end || "",
//     };
//   });
//   return cleaned;
// }

// function cleanStaff(staffArr) {
//   return staffArr
//     .filter((s) => s.name && s.name.trim()) // remove empty staff
//     .map((s) => ({
//       name: s.name,
//       role: s.role || "other", // model enum fix
//       phone: s.phone || "",
//       specialization: s.specialization
//         ? [s.specialization]
//         : [], // model requires array, not string
//     }));
// }

//   // ============================================
//   // WORKING HOURS HANDLERS
//   // ============================================
//   const handleWorkingHoursChange = (day, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       workingHours: {
//         ...prev.workingHours,
//         [day]: {
//           ...prev.workingHours[day],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   // ============================================
//   // STAFF HANDLERS
//   // ============================================
//   const handleStaffChange = (index, field, value) => {
//     const newStaff = [...formData.staff];
//     newStaff[index][field] = value;
//     setFormData((prev) => ({ ...prev, staff: newStaff }));
//   };

//   const addStaff = () => {
//     setFormData((prev) => ({
//       ...prev,
//       staff: [
//         ...prev.staff,
//         { name: "", role: "", phone: "", specialization: "" },
//       ],
//     }));
//   };

//   const removeStaff = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       staff: prev.staff.filter((_, i) => i !== index),
//     }));
//   };

//   // ============================================
//   // VALIDATE COORDINATES
//   // ============================================
//   const validateCoordinates = () => {
//     const lat = parseFloat(formData.latitude);
//     const lng = parseFloat(formData.longitude);
//     if (isNaN(lat) || isNaN(lng)) return false;
//     if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
//     return true;
//   };

//   // ============================================
//   // FORM SUBMISSION - WITH SINGLE IMAGE
//   // ============================================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Validation
//       if (!formData.shopName.trim()) {
//         setError("Shop name is required");
//         setLoading(false);
//         return;
//       }

//       if (
//         !formData.address.trim() ||
//         !formData.city.trim() ||
//         !formData.state.trim()
//       ) {
//         setError("Complete address is required");
//         setLoading(false);
//         return;
//       }

//       if (formData.services.length === 0 || !formData.services[0].name) {
//         setError("Add at least one service");
//         setLoading(false);
//         return;
//       }

//       if (
//         formData.latitude &&
//         formData.longitude &&
//         !validateCoordinates()
//       ) {
//         setError(
//           "Please enter valid latitude (-90 to 90) and longitude (-180 to 180)"
//         );
//         setLoading(false);
//         return;
//       }

//       // ============================================
//       // CREATE FORMDATA
//       // ============================================
//       const submitFormData = new FormData();

//       // Basic shop info
//       submitFormData.append("shopName", formData.shopName);
//       submitFormData.append("description", formData.description);
//       submitFormData.append("address", formData.address);
//       submitFormData.append("city", formData.city);
//       submitFormData.append("state", formData.state);
//       submitFormData.append("zipCode", formData.zipCode);
//       submitFormData.append("latitude", parseFloat(formData.latitude) || 0);
//       submitFormData.append("longitude", parseFloat(formData.longitude) || 0);

//       // Get barber owner ID from localStorage
//       const userId = localStorage.getItem("userId");
//       submitFormData.append("barberOwner", userId || "");

//       // ============================================
//       // SINGLE IMAGE ONLY
//       // ============================================
//       if (formData.image) {
//         submitFormData.append("image", formData.image);
//       }

//       // Services
//       // submitFormData.append(
//       //   "services",
//       //   JSON.stringify(
//       //     formData.services.map((s) => ({
//       //       name: s.name,
//       //       price: Number(s.price),
//       //       duration: Number(s.duration),
//       //       category: s.category,
//       //     }))
//       //   )
//       // );

//     submitFormData.append(
//   "services",
//   JSON.stringify(
//     formData.services.map((s) => ({
//       name: s.name,
//       price: Number(s.price),
//       duration: Number(s.duration),
//       category: s.category,
//       description: s.description || "",
//     }))
//   )
// );


//       // Working hours
//       submitFormData.append(
//   "workingHours",
//   JSON.stringify(cleanWorkingHours(formData.workingHours))
// );


//       // Staff
//       // submitFormData.append(
//       //   "staff",
//       //   JSON.stringify(formData.staff.filter((s) => s.name.trim()))
//       // );
// submitFormData.append(
//   "staff",
//   JSON.stringify(cleanStaff(formData.staff))
// );


//       console.log("📤 Sending data with single image...");

//       const token = localStorage.getItem("token");

//       // ============================================
//       // API CALL - MULTIPART WITH SINGLE IMAGE
//       // ============================================
//       const response = await axios.post(
//         "http://localhost:5000/api/barbers/register-shop",
//         submitFormData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("✅ Response:", response.data);

//       if (response.data.success) {
//         setSuccess("✅ Shop registered successfully! Redirecting...");
//         setTimeout(() => router.push("/barber-shop"), 2000);
//       } else {
//         setError(response.data.message || "Failed to register shop");
//       }
//     } catch (err) {
//       console.error("❌ Registration error:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Failed to register shop");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const days = [
//     "monday",
//     "tuesday",
//     "wednesday",
//     "thursday",
//     "friday",
//     "saturday",
//     "sunday",
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto py-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
//             <Building2 className="w-8 h-8 text-teal-400" />
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
//             Register Your Barbershop
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Set up your business profile and start accepting bookings
//           </p>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
//             <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//             <p className="text-red-300 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Success Alert */}
//         {success && (
//           <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start space-x-3">
//             <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
//             <p className="text-green-300 text-sm">{success}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Shop Information */}
//           <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
//               <Building2 className="w-6 h-6 text-teal-400" />
//               <span>Shop Information</span>
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <Label className="text-white font-semibold mb-2 block">
//                   Shop Name *
//                 </Label>
//                 <Input
//                   type="text"
//                   name="shopName"
//                   value={formData.shopName}
//                   onChange={handleInputChange}
//                   placeholder="Enter shop name"
//                   className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label className="text-white font-semibold mb-2 block">
//                   Description
//                 </Label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   placeholder="Tell customers about your shop"
//                   rows="3"
//                   className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50 rounded-lg p-3 resize-none"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* ============================================ */}
//           {/* SINGLE IMAGE UPLOAD SECTION */}
//           {/* ============================================ */}
//           <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
//               <ImageIcon className="w-6 h-6 text-teal-400" />
//               <span>Shop Image</span>
//             </h2>

//             <div className="space-y-4">
//               {/* Upload Input */}
//               <div>
//                 <Label className="text-gray-300 text-sm mb-2 block">
//                   Upload Shop Image (Optional - One image only)
//                 </Label>
//                 <label className="w-full bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border-2 border-dashed border-teal-500/50 rounded-lg px-4 py-6 flex items-center justify-center space-x-2 transition cursor-pointer">
//                   <ImageIcon className="w-5 h-5" />
//                   <span>Click to select image</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                 </label>

//                 <p className="text-gray-400 text-xs mt-2">
//                   ℹ️ Supported formats: JPG, PNG, WebP | Max 5MB
//                 </p>
//               </div>

//               {/* Single Image Preview */}
//               {imagePreview && (
//                 <div className="relative">
//                   <div className="relative w-full max-w-sm mx-auto bg-gray-800 rounded-lg overflow-hidden aspect-square">
//                     <img
//                       src={imagePreview}
//                       alt="Selected image"
//                       className="w-full h-full object-cover"
//                     />

//                     {/* Remove Button */}
//                     <button
//                       type="button"
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 rounded-full p-2 transition"
//                     >
//                       <X className="w-5 h-5 text-white" />
//                     </button>
//                   </div>

//                   {/* Image Selected Indicator */}
//                   <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg mt-3">
//                     <p className="text-teal-300 text-sm">
//                       ✓ Image selected: {formData.image?.name}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* ============================================ */}
//           {/* LOCATION INFORMATION */}
//           {/* ============================================ */}
//           <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
//               <MapPin className="w-6 h-6 text-teal-400" />
//               <span>Location</span>
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <Label className="text-white font-semibold mb-2 block">
//                   Address *
//                 </Label>
//                 <Input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   placeholder="Street address"
//                   className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div>
//                   <Label className="text-white font-semibold mb-2 block">
//                     City *
//                   </Label>
//                   <Input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     placeholder="City"
//                     className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-white font-semibold mb-2 block">
//                     State *
//                   </Label>
//                   <Input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     placeholder="State"
//                     className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-white font-semibold mb-2 block">
//                     Zip Code
//                   </Label>
//                   <Input
//                     type="text"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleInputChange}
//                     placeholder="Zip code"
//                     className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
//                   />
//                 </div>
//               </div>

//               {/* Coordinates */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-white font-semibold mb-2 block">
//                     Latitude
//                   </Label>
//                   <Input
//                     type="number"
//                     step="0.000001"
//                     name="latitude"
//                     value={formData.latitude}
//                     onChange={handleInputChange}
//                     placeholder="Latitude (-90 to 90)"
//                     className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
//                   />
//                   <p className="text-gray-400 text-xs mt-1">
//                     ℹ️ e.g., 22.123456
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-white font-semibold mb-2 block">
//                     Longitude
//                   </Label>
//                   <Input
//                     type="number"
//                     step="0.000001"
//                     name="longitude"
//                     value={formData.longitude}
//                     onChange={handleInputChange}
//                     placeholder="Longitude (-180 to 180)"
//                     className="bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-600 focus:border-teal-500/50"
//                   />
//                   <p className="text-gray-400 text-xs mt-1">
//                     ℹ️ e.g., 75.123456
//                   </p>
//                 </div>
//               </div>

//               {/* Auto-Fetch Button */}
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={handleFetchCoordinates}
//                   disabled={fetchingLocation}
//                   className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 text-cyan-300 font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
//                 >
//                   {fetchingLocation ? (
//                     <>
//                       <Loader className="w-4 h-4 animate-spin" />
//                       <span>Fetching...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Navigation className="w-4 h-4" />
//                       <span>Auto-Fetch Coordinates</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* Services */}
//           <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
//                 <span>💇</span>
//                 <span>Services</span>
//               </h2>
//               <Button
//                 type="button"
//                 onClick={addService}
//                 className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add Service</span>
//               </Button>
//             </div>
//             <div className="space-y-4">
//               {formData.services.map((service, idx) => (
//                 <div
//                   key={idx}
//                   className="p-4 border border-gray-700/50 bg-gray-800/20 rounded-lg space-y-3"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="text-white font-semibold">Service {idx + 1}</h4>
//                     {formData.services.length > 1 && (
//                       <Button
//                         type="button"
//                         onClick={() => removeService(idx)}
//                         className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded p-1"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-300 text-sm mb-1 block">
//                         Service Name *
//                       </Label>
//                       <select
//   value={service.name}
//   onChange={(e) => handleServiceChange(idx, "name", e.target.value)}
//   className="
//     w-full
//     bg-gray-800/60
//     border border-gray-700
//     text-white
//     rounded-lg
//     px-3 py-2.5
//     text-sm
//     focus:outline-none
//     focus:border-teal-500
//     focus:ring-1
//     focus:ring-teal-500
//     transition
//     appearance-none
//   "
//   required
// >
//   <option value="">Select Service</option>
//   <option value="haircut">Haircut</option>
//   <option value="beard">Beard</option>
//   <option value="styling">Styling</option>
//   <option value="treatment">Treatment</option>
//   <option value="wash">Wash</option>
//   <option value="other">Other</option>
// </select>

//                     </div>
//                     <div>
//                       <Label className="text-gray-300 text-sm mb-1 block">
//                         Price (₹) *
//                       </Label>
//                       <Input
//                         type="number"
//                         value={service.price}
//                         onChange={(e) =>
//                           handleServiceChange(idx, "price", e.target.value)
//                         }
//                         placeholder="Price"
//                         className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-300 text-sm mb-1 block">
//                         Duration (min) *
//                       </Label>
//                       <Input
//                         type="number"
//                         value={service.duration}
//                         onChange={(e) =>
//                           handleServiceChange(idx, "duration", e.target.value)
//                         }
//                         placeholder="30"
//                         className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-300 text-sm mb-1 block">
//                         Category
//                       </Label>
//                       <select
//                         value={service.category}
//                         onChange={(e) =>
//                           handleServiceChange(idx, "category", e.target.value)
//                         }
//                         className="w-full bg-gray-700/50 border border-gray-600 text-white rounded px-3 py-2 text-sm"
//                       >
//                         <option value="haircut">Haircut</option>
//                         <option value="beard">Beard</option>
//                         <option value="styling">Styling</option>
//                         <option value="treatment">Treatment</option>
//                         <option value="other">Other</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Working Hours */}
//           <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
//               <Clock className="w-6 h-6 text-teal-400" />
//               <span>Working Hours</span>
//             </h2>
//             <div className="space-y-3">
//               {days.map((day) => (
//                 <div key={day} className="flex items-center space-x-3">
//                   <label className="flex items-center space-x-2 cursor-pointer flex-shrink-0">
//                     <input
//                       type="checkbox"
//                       checked={formData.workingHours[day].isOpen}
//                       onChange={(e) =>
//                         handleWorkingHoursChange(day, "isOpen", e.target.checked)
//                       }
//                       className="rounded border-gray-600 text-teal-500"
//                     />
//                     <span className="text-white font-semibold capitalize w-20">
//                       {day}
//                     </span>
//                   </label>
//                   {formData.workingHours[day].isOpen && (
//                     <div className="flex items-center space-x-2 flex-1">
//                       <Input
//                         type="time"
//                         value={formData.workingHours[day].start}
//                         onChange={(e) =>
//                           handleWorkingHoursChange(day, "start", e.target.value)
//                         }
//                         className="bg-gray-800/50 border border-gray-700 text-white w-24 text-sm"
//                       />
//                       <span className="text-gray-400">to</span>
//                       <Input
//                         type="time"
//                         value={formData.workingHours[day].end}
//                         onChange={(e) =>
//                           handleWorkingHoursChange(day, "end", e.target.value)
//                         }
//                         className="bg-gray-800/50 border border-gray-700 text-white w-24 text-sm"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Staff Members */}
//           <section className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-white">Staff Members</h2>
//               <Button
//                 type="button"
//                 onClick={addStaff}
//                 className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add Staff</span>
//               </Button>
//             </div>

//             <div className="space-y-4">
//               {formData.staff.map((member, idx) => (
//                 <div
//                   key={idx}
//                   className="p-4 border border-gray-700/50 bg-gray-800/20 rounded-lg space-y-3"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="text-white font-semibold">Staff {idx + 1}</h4>
//                     {formData.staff.length > 1 && (
//                       <Button
//                         type="button"
//                         onClick={() => removeStaff(idx)}
//                         className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded p-1"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-300 text-sm mb-1 block">
//                         Name
//                       </Label>
//                       <Input
//                         type="text"
//                         value={member.name}
//                         onChange={(e) =>
//                           handleStaffChange(idx, "name", e.target.value)
//                         }
//                         placeholder="Staff name"
//                         className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-300 text-sm mb-1 block">
//                         Role
//                       </Label>
//                      <select
//   value={member.role}
//   onChange={(e) => handleStaffChange(idx, "role", e.target.value)}
//   className="
//     w-full
//     bg-gray-800/60
//     border border-gray-700
//     text-white
//     rounded-lg
//     px-3 py-2.5
//     text-sm
//     focus:outline-none
//     focus:border-teal-500
//     focus:ring-1
//     focus:ring-teal-500
//     transition
//     appearance-none
//   "
// >
//   <option value="">Select Role</option>
//   <option value="barber">Barber</option>
//   <option value="assistant">Assistant</option>
//   <option value="manager">Manager</option>
//   <option value="other">Other</option>
// </select>


//                     </div>
//                   </div>
//                   <div>
//                     <Label className="text-gray-300 text-sm mb-1 block">
//                       Phone
//                     </Label>
//                     <Input
//                       type="tel"
//                       value={member.phone}
//                       onChange={(e) =>
//                         handleStaffChange(idx, "phone", e.target.value)
//                       }
//                       placeholder="Phone number"
//                       className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <Label className="text-gray-300 text-sm mb-1 block">
//                       Specialization
//                     </Label>
//                     <Input
//                       type="text"
//                       value={member.specialization}
//                       onChange={(e) =>
//                         handleStaffChange(idx, "specialization", e.target.value)
//                       }
//                       placeholder="e.g., Hair Styling, Beard Trimming"
//                       className="bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Submit Buttons */}
//           <div className="flex gap-4">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-black font-semibold rounded-lg transition"
//             >
//               {loading ? "Registering..." : "Register Shop"}
//             </Button>
//             <Button
//               type="button"
//               onClick={() => router.back()}
//               className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



