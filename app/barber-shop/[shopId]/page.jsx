"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";

export default function ShopDetailPage() {
  const { shopId } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});

 useEffect(() => {
  async function fetchShop() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // or wherever you keep the auth token
      const response = await axios.get(`http://localhost:5000/api/barbers/barber-shop/${shopId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setShop(response.data.shop);
        setFormData(response.data.shop);
      } else {
        setShop(null);
      }
    } catch (error) {
      console.error("Failed to fetch shop:", error);
      setShop(null);
    } finally {
      setLoading(false);
    }
  }

  if (shopId) {
    fetchShop();
  }
}, [shopId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/barbershops/${shopId}`,
        formData
      );
      if (response.data.success) {
        alert("Shop updated successfully!");
        setShop(response.data.shop);
        setFormData(response.data.shop);
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to update shop:", error);
      alert("Error updating shop");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData(shop);
    setEditing(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading shop details...</div>
      </div>
    );

  if (!shop)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-white text-xl">Shop not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-teal-400 hover:text-teal-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <Button
            onClick={() => setEditing(!editing)}
            className="flex items-center space-x-2"
          >
            {editing ? (
              <>
                <X className="w-5 h-5" />
                <span>Cancel Edit</span>
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5" />
                <span>Edit Shop</span>
              </>
            )}
          </Button>
        </div>

        {/* Shop Information */}
        <Card className="bg-gray-800 border border-gray-700 mb-8">
          <CardHeader className="bg-gray-700 border-b border-gray-600">
            <CardTitle className="text-white text-3xl">{shop.shopName}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!editing ? (
              // View Mode
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-2">Description</h3>
                  <p className="text-gray-300">{shop.description || "No description provided"}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-2">Location</h3>
                  <div className="text-gray-300 space-y-1">
                    <p>
                      <strong>Address:</strong> {shop.location?.address}
                    </p>
                    <p>
                      <strong>City:</strong> {shop.location?.city}
                    </p>
                    <p>
                      <strong>State:</strong> {shop.location?.state}
                    </p>
                    <p>
                      <strong>Zip Code:</strong> {shop.location?.zipCode}
                    </p>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-2">Services</h3>
                  <div className="space-y-2">
                    {shop.services && shop.services.length > 0 ? (
                      shop.services.map((service, index) => (
                        <div key={index} className="bg-gray-700 p-3 rounded">
                          <p className="text-white">
                            <strong>{service.name}</strong> - ₹{service.price}
                          </p>
                          <p className="text-gray-400 text-sm">Duration: {service.duration} mins</p>
                          <p className="text-gray-400 text-sm">Category: {service.category}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No services added</p>
                    )}
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-2">Ratings</h3>
                  <p className="text-gray-300">
                    Average: {shop.ratings?.average?.toFixed(1) || "0"} / 5 ({shop.ratings?.count || 0} reviews)
                  </p>
                </div>

                {/* Earnings */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-2">Earnings</h3>
                  <div className="text-gray-300 space-y-1">
                    <p>
                      <strong>Total Earnings:</strong> ₹{shop.earnings?.total || 0}
                    </p>
                    <p>
                      <strong>Pending:</strong> ₹{shop.earnings?.pending || 0}
                    </p>
                  </div>
                </div>

                {/* Verification Status */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-2">Shop Status</h3>
                  <p className="text-gray-300">
                    <strong>Verified:</strong> {shop.isVerified ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-300">
                    <strong>Active:</strong> {shop.isActive ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shop Name */}
                <div>
                  <label className="block text-teal-400 font-semibold mb-2">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName || ""}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-400 outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-teal-400 font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-400 outline-none"
                  />
                </div>

                {/* Location Fields */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-3">Location</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.location?.address || ""}
                      onChange={(e) => handleLocationChange(e)}
                      className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-400 outline-none"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.location?.city || ""}
                      onChange={(e) => handleLocationChange(e)}
                      className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-400 outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.location?.state || ""}
                      onChange={(e) => handleLocationChange(e)}
                      className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-400 outline-none"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      value={formData.location?.zipCode || ""}
                      onChange={(e) => handleLocationChange(e)}
                      className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-teal-400 outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={updating}
                    className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700"
                  >
                    <Save className="w-5 h-5" />
                    <span>{updating ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Staff Section */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader className="bg-gray-700 border-b border-gray-600">
            <CardTitle className="text-white">Staff</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {shop.staff && shop.staff.length > 0 ? (
              <div className="space-y-3">
                {shop.staff.map((member, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded">
                    <p className="text-white">
                      <strong>{member.name}</strong> - {member.role}
                    </p>
                    <p className="text-gray-400 text-sm">Phone: {member.phone}</p>
                    <p className="text-gray-400 text-sm">
                      Specialization: {member.specialization?.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No staff members added</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
