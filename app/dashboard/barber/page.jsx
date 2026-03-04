"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2 } from "lucide-react";

export default function BarberDashboardPage() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const barberId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!barberId) {
      router.push("/auth/barber-login");
      return;
    }

    async function fetchShops() {
      setLoading(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/barber/barbershops?barberId=${barberId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setShops(response.data.shops);
        } else {
          setShops([]);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        setShops([]);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, [barberId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">My Shops</h1>
          <Link href="/auth/barber-registration" passHref>
            <Button className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
              <Plus className="w-5 h-5" />
              <span>Add New Shop</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading your shops...</div>
        ) : shops.length === 0 ? (
          <div className="text-center text-gray-400">
            No shops registered yet. <br />
            Click &quot;Add New Shop&quot; to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.map((shop) => (
              <Card
                key={shop._id}
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-teal-500/50 transition-shadow"
              >
                <CardHeader className="flex items-center space-x-4">
                  <Building2 className="w-10 h-10 text-teal-400" />
                  <CardTitle className="text-white font-semibold truncate">
                    {shop.shopName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-3">
                  <p className="mb-2">
                    {shop.description || "No description provided."}
                  </p>
                  <p>
                    <strong>Location:</strong> {shop.location?.address},{" "}
                    {shop.location?.city}
                  </p>
                  <p>
                    <strong>Services:</strong>{" "}
                    {shop.services?.map((s) => s.name).join(", ")}
                  </p>
                  <p>
                    <strong>Rating:</strong>{" "}
                    {shop.ratings?.average?.toFixed(1) || "0"} (
                    {shop.ratings?.count || 0} reviews)
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
