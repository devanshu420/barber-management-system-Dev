"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Clock } from "lucide-react";
import axios from "axios";

export default function WalletPage() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({
    balance: 0,
    pending: 0,
    transactions: [],
  });
  const [error, setError] = useState("");

  // Fetch wallet data from API on mount
  useEffect(() => {
    async function fetchWallet() {
      setLoading(true);
      try {
        // Replace with your API endpoint and auth token as needed
        const response = await axios.get("/api/user/wallet");
        if (response.data.success) {
          setWallet(response.data.wallet);
          setError("");
        } else {
          setError("Failed to load wallet data");
        }
      } catch (err) {
        setError(err.message || "Error fetching wallet data");
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-white text-center">
          Your Wallet
        </h1>

        {loading ? (
          <p className="text-gray-400 text-center">Loading wallet data...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {/* Wallet Summary */}
            <Card className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-white text-xl font-semibold">
                  Current Balance
                </CardTitle>
                <DollarSign className="w-6 h-6 text-teal-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-teal-400">
                  ₹{wallet.balance.toFixed(2)}
                </p>
                <p className="text-gray-400 mt-2">
                  Pending: ₹{wallet.pending.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            {/* Transactions List */}
            <Card className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              <CardHeader className="text-white text-xl font-semibold">
                Recent Transactions
              </CardHeader>
              <CardContent className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
                {wallet.transactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-6">No transactions yet.</p>
                ) : (
                  wallet.transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex justify-between items-center py-3"
                    >
                      <div>
                        <p className="text-white font-medium">{txn.description}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(txn.date).toLocaleDateString()} &bull;{" "}
                          {new Date(txn.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div
                        className={`font-semibold ${
                          txn.amount >= 0 ? "text-teal-400" : "text-red-500"
                        }`}
                      >
                        {txn.amount >= 0 ? "+" : "-"}₹{Math.abs(txn.amount).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="text-center">
              <Button
                size="lg"
                className="px-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold rounded-lg"
                onClick={() => alert("Withdraw feature coming soon!")}
              >
                Withdraw Funds
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
