"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react"

// Mock earnings data
const earningsData = {
  today: 125,
  week: 450,
  month: 1850,
  year: 22400,
  recentTransactions: [
    { id: "1", customer: "John Smith", service: "Classic Haircut", amount: 25, date: "2024-01-15", time: "10:00 AM" },
    { id: "2", customer: "Mike Johnson", service: "Beard Trim", amount: 20, date: "2024-01-15", time: "11:30 AM" },
    { id: "3", customer: "David Wilson", service: "Premium Package", amount: 50, date: "2024-01-14", time: "3:00 PM" },
    { id: "4", customer: "Robert Brown", service: "Hair Styling", amount: 15, date: "2024-01-14", time: "4:30 PM" },
  ],
}

export function EarningsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Earnings Overview
        </CardTitle>
        <CardDescription>Your earnings summary and recent transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earnings Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-2xl font-bold text-foreground">${earningsData.today}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold text-foreground">${earningsData.week}</p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold text-primary">${earningsData.month}</p>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <p className="text-sm text-muted-foreground">This Year</p>
            <p className="text-2xl font-bold text-accent">${earningsData.year}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Recent Transactions</h4>
            <Badge variant="secondary">{earningsData.recentTransactions.length} today</Badge>
          </div>

          <div className="space-y-2">
            {earningsData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{transaction.customer}</p>
                  <p className="text-xs text-muted-foreground">{transaction.service}</p>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(transaction.date).toLocaleDateString()} at {transaction.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">${transaction.amount}</p>
                  <Badge variant="outline" className="text-xs">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Monthly Goal Progress</p>
              <p className="text-xs text-muted-foreground">Target: $2,000</p>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-accent mr-1" />
              <span className="text-sm font-bold">92.5%</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-accent h-2 rounded-full" style={{ width: "92.5%" }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
