"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Users, Star, AlertCircle } from "lucide-react"

interface OverviewStatsProps {
  stats: {
    totalUsers: number
    totalBarbers: number
    totalBookings: number
    monthlyRevenue: number
    activeBookings: number
    pendingApprovals: number
    averageRating: number
    systemHealth: string
  }
}

// Mock data for charts and trends
const recentActivity = [
  { type: "booking", message: "New booking by John Smith", time: "2 minutes ago" },
  { type: "user", message: "New barber application from Mike Johnson", time: "15 minutes ago" },
  { type: "payment", message: "Payment of $50 processed", time: "1 hour ago" },
  { type: "review", message: "New 5-star review received", time: "2 hours ago" },
  { type: "booking", message: "Booking cancelled by Sarah Wilson", time: "3 hours ago" },
]

const topBarbers = [
  { name: "John Doe", bookings: 45, revenue: 1125, rating: 4.9 },
  { name: "Sarah Wilson", bookings: 38, revenue: 950, rating: 4.8 },
  { name: "Mike Smith", bookings: 32, revenue: 800, rating: 4.7 },
  { name: "Alex Johnson", bookings: 28, revenue: 700, rating: 4.6 },
]

export function OverviewStats({ stats }: OverviewStatsProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-4 h-4 text-primary" />
      case "user":
        return <Users className="w-4 h-4 text-accent" />
      case "payment":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "review":
        return <Star className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Revenue Goal</span>
                <span>$45,600 / $50,000</span>
              </div>
              <Progress value={91.2} className="h-2" />
              <p className="text-xs text-muted-foreground">91.2% of monthly target</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Customer Satisfaction</span>
                <span>{stats.averageRating}/5.0</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground">Based on {stats.totalBookings} reviews</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Barber Utilization</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">Average booking rate</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Barbers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Barbers</CardTitle>
            <CardDescription>This month's highest performers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBarbers.map((barber, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{barber.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {barber.bookings} bookings • ★ {barber.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent">${barber.revenue}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Server Status</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payment Gateway</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Sessions</span>
              <Badge variant="outline">247 users</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pending Approvals</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {stats.pendingApprovals}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
