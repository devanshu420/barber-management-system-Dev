"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt, Download, Search, Filter } from "lucide-react"

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [transactions] = useState([
    {
      id: "txn_001",
      type: "booking",
      amount: 45,
      description: "Premium Haircut - Mike Johnson",
      date: "2024-01-15",
      status: "completed",
      paymentMethod: "Credit Card",
      bookingId: "book_001",
    },
    {
      id: "txn_002",
      type: "wallet_add",
      amount: 100,
      description: "Wallet Top-up",
      date: "2024-01-14",
      status: "completed",
      paymentMethod: "Credit Card",
    },
    {
      id: "txn_003",
      type: "booking",
      amount: 25,
      description: "Beard Trim - Sarah Wilson",
      date: "2024-01-12",
      status: "completed",
      paymentMethod: "Wallet",
      bookingId: "book_002",
    },
    {
      id: "txn_004",
      type: "refund",
      amount: 35,
      description: "Booking Cancellation Refund",
      date: "2024-01-10",
      status: "completed",
      paymentMethod: "Credit Card",
      bookingId: "book_003",
    },
  ])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "booking":
        return "text-blue-600"
      case "refund":
        return "text-green-600"
      case "wallet_add":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Transaction History
        </CardTitle>
        <CardDescription>View and manage your payment transactions</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.description}</p>
                  <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>ID: {transaction.id}</span>
                  <span>{transaction.date}</span>
                  <span>{transaction.paymentMethod}</span>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-medium text-lg ${getTypeColor(transaction.type)}`}>
                  {transaction.type === "refund" || transaction.type === "wallet_add" ? "+" : "-"}$
                  {transaction.amount}
                </p>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No transactions found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
