"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react"

export function WalletManagement() {
  const [balance] = useState(125.5)
  const [addAmount, setAddAmount] = useState("")
  const [transactions] = useState([
    { id: 1, type: "credit", amount: 50, description: "Added funds", date: "2024-01-15", status: "completed" },
    { id: 2, type: "debit", amount: 25, description: "Haircut booking", date: "2024-01-14", status: "completed" },
    { id: 3, type: "credit", amount: 100, description: "Added funds", date: "2024-01-10", status: "completed" },
    { id: 4, type: "debit", amount: 35, description: "Beard trim booking", date: "2024-01-08", status: "completed" },
  ])

  const handleAddFunds = () => {
    // Handle adding funds to wallet
    console.log("Adding funds:", addAmount)
    setAddAmount("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription>Manage your wallet funds and view transaction history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">${balance.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label htmlFor="addAmount">Add Funds</Label>
            <div className="flex gap-2">
              <Input
                id="addAmount"
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
              <Button onClick={handleAddFunds} disabled={!addAmount}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAddAmount("25")}>
                $25
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAddAmount("50")}>
                $50
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAddAmount("100")}>
                $100
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
