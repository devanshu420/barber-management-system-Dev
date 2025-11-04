"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function ShopDetailPage() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    shopName: "",
    description: "",
    // Add other fields you want editable
  });

  useEffect(() => {
    async function fetchShop() {
      try {
        const response = await axios.get(`http://localhost:5000/api/barbershops/${shopId}`);
        if (response.data.success) {
          setShop(response.data.shop);
          setForm({
            shopName: response.data.shop.shopName || "",
            description: response.data.shop.description || "",
            // Fill other fields as needed
          });
        }
      } catch (error) {
        console.error("Failed to fetch shop", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShop();
  }, [shopId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/barbershops/${shopId}`, form);
      if (response.data.success) {
        alert("Shop updated successfully!");
        setShop(response.data.shop);
      }
    } catch (error) {
      console.error("Failed to update shop", error);
      alert("Error updating shop");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading shop details...</div>;
  if (!shop) return <div>Shop not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-md">
      <h1 className="text-3xl mb-4">{shop.shopName}</h1>
      <p className="mb-4">Pending Bookings: {shop.earnings?.pending || 0}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="shopName">Shop Name</label>
          <input
            id="shopName"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            className="w-full text-black p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full text-black p-2 rounded"
          />
        </div>

        {/* Add more form fields similarly for address, services etc. */}

        <button
          type="submit"
          disabled={updating}
          className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Shop"}
        </button>
      </form>
    </div>
  );
}
