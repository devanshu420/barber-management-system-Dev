"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Download, Calendar } from "lucide-react"

// Mock financial data
const financialData = {
  totalRevenue: 45600,
  monthlyGrowth: 8.2,
  totalTransactions: 1247,
  averageBookingValue: 36.5,
  topServices: [
    { name: "Classic Haircut", revenue: 15600, bookings: 624, percentage: 34.2 },
    { name: "Premium Package", revenue: 12500, bookings: 250, percentage: 27.4 },
    { name: "Beard Trim & Shave", revenue: 8900, bookings: 445, percentage: 19.5 },
    { name: "Hair Styling", revenue: 4200, bookings: 280, percentage: 9.2 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 38400, bookings: 1052 },
    { month: "Feb", revenue: 42100, bookings: 1154 },
    { month: "Mar", revenue: 39800, bookings: 1089 },
    { month: "Apr", revenue: 45600, bookings: 1247 },
  ],
  paymentMethods: [
    { method: "Credit Card", amount: 32400, percentage: 71.1 },
    { method: "Debit Card", amount: 8900, percentage: 19.5 },
    { method: "Cash", amount: 3200, percentage: 7.0 },
    { method: "Digital Wallet", amount: 1100, percentage: 2.4 },
  ],
}

export function FinancialReports() {
  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">${financialData.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{financialData.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground">{financialData.totalTransactions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Booking Value</p>
                <p className="text-2xl font-bold text-foreground">${financialData.averageBookingValue}</p>
                <p className="text-sm text-muted-foreground mt-1">Per booking</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold text-green-600">+{financialData.monthlyGrowth}%</p>
                <p className="text-sm text-muted-foreground mt-1">Month over month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services by Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Top Services by Revenue</CardTitle>
            <CardDescription>Most profitable services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm font-bold text-accent">${service.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{service.bookings} bookings</span>
                      <span>{service.percentage}% of total</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${service.percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{method.method}</p>
                      <p className="text-sm font-bold">${method.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{method.percentage}% of total</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: `${method.percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <CardDescription>Revenue and booking trends over time</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="4months">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4months">Last 4 months</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="12months">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.monthlyRevenue.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{month.month} 2024</p>
                    <p className="text-sm text-muted-foreground">{month.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${month.revenue.toLocaleString()}</p>
                  {index > 0 && (
                    <div className="flex items-center justify-end">
                      {month.revenue > financialData.monthlyRevenue[index - 1].revenue ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm ${
                          month.revenue > financialData.monthlyRevenue[index - 1].revenue
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(
                          ((month.revenue - financialData.monthlyRevenue[index - 1].revenue) /
                            financialData.monthlyRevenue[index - 1].revenue) *
                            100,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download detailed financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Download className="w-6 h-6 mb-2" />
              <span>Revenue Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Download className="w-6 h-6 mb-2" />
              <span>Transaction Log</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Download className="w-6 h-6 mb-2" />
              <span>Tax Summary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
