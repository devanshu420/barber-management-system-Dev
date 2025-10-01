"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

interface AppointmentStatus {
  id: string
  customerName: string
  customerAvatar?: string
  service: string
  scheduledTime: string
  status: "upcoming" | "in-progress" | "completed" | "cancelled" | "no-show"
  estimatedDuration: number
  actualStartTime?: string
  notes?: string
}

export function LiveStatusUpdates() {
  const [appointments, setAppointments] = useState<AppointmentStatus[]>([
    {
      id: "1",
      customerName: "John Smith",
      customerAvatar: "/professional-barber-headshot.jpg",
      service: "Premium Haircut",
      scheduledTime: "2:00 PM",
      status: "in-progress",
      estimatedDuration: 45,
      actualStartTime: "2:05 PM",
      notes: "Customer arrived 5 minutes late",
    },
    {
      id: "2",
      customerName: "Mike Johnson",
      service: "Beard Trim",
      scheduledTime: "3:00 PM",
      status: "upcoming",
      estimatedDuration: 30,
    },
    {
      id: "3",
      customerName: "David Wilson",
      service: "Full Service",
      scheduledTime: "4:00 PM",
      status: "upcoming",
      estimatedDuration: 75,
    },
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateAppointmentStatus = (id: string, newStatus: AppointmentStatus["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status: newStatus,
              actualStartTime:
                newStatus === "in-progress"
                  ? currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : apt.actualStartTime,
            }
          : apt,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      case "no-show":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTimeRemaining = (scheduledTime: string, duration: number) => {
    const now = new Date()
    const scheduled = new Date()
    const [time, period] = scheduledTime.split(" ")
    const [hours, minutes] = time.split(":").map(Number)

    scheduled.setHours(period === "PM" && hours !== 12 ? hours + 12 : hours === 12 && period === "AM" ? 0 : hours)
    scheduled.setMinutes(minutes)

    const diff = scheduled.getTime() - now.getTime()
    const minutesRemaining = Math.floor(diff / (1000 * 60))

    if (minutesRemaining > 0) {
      return `in ${minutesRemaining} minutes`
    } else if (minutesRemaining > -duration) {
      return "in progress"
    } else {
      return "overdue"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          Live Appointment Status
        </CardTitle>
        <CardDescription>Real-time updates for today's appointments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={appointment.customerAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{appointment.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{appointment.customerName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.service}</p>
                </div>
              </div>
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusIcon(appointment.status)}
                <span className="ml-1 capitalize">{appointment.status.replace("-", " ")}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Scheduled: {appointment.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Duration: {appointment.estimatedDuration}min</span>
              </div>
            </div>

            {appointment.actualStartTime && (
              <div className="text-sm text-muted-foreground">Started at: {appointment.actualStartTime}</div>
            )}

            {appointment.notes && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">Note: {appointment.notes}</div>
            )}

            <div className="flex gap-2">
              {appointment.status === "upcoming" && (
                <>
                  <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "in-progress")}>
                    Start Service
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {appointment.status === "in-progress" && (
                <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "completed")}>
                  Complete Service
                </Button>
              )}

              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              {getTimeRemaining(appointment.scheduledTime, appointment.estimatedDuration)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
