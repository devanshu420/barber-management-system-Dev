"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Plus, Edit, Trash2 } from "lucide-react"

// Mock schedule data
const weeklySchedule = {
  monday: { enabled: true, start: "9:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
  tuesday: { enabled: true, start: "9:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
  wednesday: { enabled: true, start: "9:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
  thursday: { enabled: true, start: "9:00", end: "18:00", breaks: [{ start: "12:00", end: "13:00" }] },
  friday: { enabled: true, start: "9:00", end: "20:00", breaks: [{ start: "12:00", end: "13:00" }] },
  saturday: { enabled: true, start: "10:00", end: "16:00", breaks: [] },
  sunday: { enabled: false, start: "", end: "", breaks: [] },
}

const timeOffDates = [
  { date: "2024-01-20", reason: "Personal Day" },
  { date: "2024-01-25", reason: "Vacation" },
  { date: "2024-02-14", reason: "Holiday" },
]

export function ScheduleManager() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [schedule, setSchedule] = useState(weeklySchedule)

  const handleScheduleToggle = (day: string, enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], enabled },
    }))
  }

  const getDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Set your regular working hours for each day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(schedule).map(([day, daySchedule]) => (
              <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={daySchedule.enabled}
                    onCheckedChange={(enabled) => handleScheduleToggle(day, enabled)}
                  />
                  <Label className="font-medium">{getDayName(day)}</Label>
                </div>

                {daySchedule.enabled ? (
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {daySchedule.start} - {daySchedule.end}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary">Closed</Badge>
                )}
              </div>
            ))}

            <Button className="w-full mt-4">
              <Clock className="w-4 h-4 mr-2" />
              Update Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Time Off Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Time Off & Availability</CardTitle>
            <CardDescription>Manage your time off and special availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border mb-4"
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Upcoming Time Off</Label>
              {timeOffDates.map((timeOff, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="text-sm font-medium">{new Date(timeOff.date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{timeOff.reason}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Time Off
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Schedule Actions</CardTitle>
          <CardDescription>Common schedule management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Clock className="w-6 h-6 mb-2" />
              <span>Block Time Slot</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Plus className="w-6 h-6 mb-2" />
              <span>Add Break</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Edit className="w-6 h-6 mb-2" />
              <span>Modify Hours</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
