"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays } from "lucide-react";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
];

const unavailableSlots = ["10:30 AM", "2:00 PM", "4:30 PM"]; // Mock unavailable slots

export function TimeSelection({ barberId, serviceDuration }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Handle date selection safely
  const handleDateSelect = (dateOrEvent) => {
    let date = null;

    // If it's a JS Date object
    if (dateOrEvent instanceof Date) {
      date = dateOrEvent;
    }
    // If it's a Synthetic Event (from input)
    else if (dateOrEvent?.target?.value) {
      date = new Date(dateOrEvent.target.value);
    }

    if (date && !isNaN(date)) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset time when date changes
    } else {
      console.error("Invalid date selected:", dateOrEvent);
    }
  };

  const handleTimeSelect = (time) => setSelectedTime(time);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      console.error("Date or time not selected");
      return;
    }

    const isoDate = selectedDate.toISOString();
    router.push(
      `/confirm-booking?barberId=${barberId}&date=${isoDate}&time=${selectedTime}`
    );
  };

  const isSlotAvailable = (time) => !unavailableSlots.includes(time);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Select Date & Time
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred appointment slot
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Calendar */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                isDisabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                className="rounded-md border w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Available Times
            </CardTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">Select a Date First</p>
                <p className="text-sm">
                  Choose a date from the calendar to see available time slots
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {timeSlots.map((time) => {
                  const isAvailable = isSlotAvailable(time);
                  const isSelected = selectedTime === time;

                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={!isAvailable}
                      onClick={() => handleTimeSelect(time)}
                      className={`relative h-12 text-sm font-medium transition-all duration-200 ${
                        !isAvailable
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      } ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    >
                      <span className="flex items-center justify-center w-full">
                        {time}
                        {!isAvailable && (
                          <Badge
                            variant="destructive"
                            className="ml-2 text-xs px-1 py-0"
                          >
                            Booked
                          </Badge>
                        )}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">
                Selected Appointment
              </p>
              <p className="text-muted-foreground">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {selectedTime}
              </p>
              {serviceDuration && (
                <p className="text-sm text-muted-foreground">
                  Duration: {serviceDuration} minutes
                </p>
              )}
            </div>
            <Button
              onClick={handleConfirm}
              size="lg"
              className="w-full sm:w-auto min-w-[140px] h-12"
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Time
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Badge } from "@/components/ui/badge";
// import { Clock, CalendarDays } from "lucide-react";

// const timeSlots = [
// 	"9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
// 	"12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
// 	"3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
// ];

// const unavailableSlots = ["10:30 AM", "2:00 PM", "4:30 PM"];

// export function TimeSelection({ barberId, serviceDuration }) {
// 	const router = useRouter();
// 	const [selectedDate, setSelectedDate] = useState(null);
// 	const [selectedTime, setSelectedTime] = useState(null);

// 	const handleDateSelect = (date) => {
// 		if (!date) return;
// 		// Always convert to Date object
// 		const parsedDate = date instanceof Date ? date : new Date(date);
// 		if (isNaN(parsedDate)) {
// 			setSelectedDate(null);
// 		} else {
// 			setSelectedDate(parsedDate);
// 		}
// 		setSelectedTime(null);
// 	};

// 	const handleTimeSelect = (time) => setSelectedTime(time);

// 	// Rename handleConfirm to handleSubmit
// 	const handleSubmit = () => {
//     console.log("Button click");
    
// 		if (!selectedDate || !selectedTime) {
// 			console.log("Date or time not selected");
// 			return;
// 		}

// 		// Ensure selectedDate is a valid Date object
// 		let isoDate = null;
// 		if (selectedDate instanceof Date && !isNaN(selectedDate)) {
// 			isoDate = selectedDate.toISOString();
// 		} else if (typeof selectedDate === "string" && !isNaN(new Date(selectedDate))) {
// 			isoDate = new Date(selectedDate).toISOString();
// 		}

// 		if (isoDate) {
// 			console.log("Navigating to:", `/confirm-booking?barberId=${barberId}&date=${isoDate}&time=${selectedTime}`);
// 			router.push(
// 				`/confirm-booking?barberId=${barberId}&date=${isoDate}&time=${selectedTime}`
// 			);
// 		} else {
// 			console.log("Invalid date", selectedDate);
// 		}
// 	};

// 	const isSlotAvailable = (time) => !unavailableSlots.includes(time);

// 	return (
// 		<div className="w-full max-w-6xl mx-auto">
// 			{/* Header */}
// 			<div className="mb-6">
// 				<h2 className="text-2xl font-bold text-foreground mb-2">Select Date & Time</h2>
// 				<p className="text-muted-foreground">Choose your preferred appointment slot</p>
// 			</div>

// 			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
// 				{/* Calendar */}
// 				<Card className="w-full">
// 					<CardHeader>
// 						<CardTitle className="flex items-center">
// 							<CalendarDays className="w-5 h-5 mr-2" />
// 							Select Date
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent className="flex justify-center">
// 						<div className="w-full max-w-sm">
// 							<Calendar
// 								mode="single"
// 								selected={selectedDate}
// 								onSelect={handleDateSelect}
// 								isDisabled={(date) => date < new Date() || date.getDay() === 0}
// 								className="rounded-md border w-full"
// 							/>
// 						</div>
// 					</CardContent>
// 				</Card>

// 				{/* Time Slots */}
// 				<Card className="w-full">
// 					<CardHeader>
// 						<CardTitle className="flex items-center">
// 							<Clock className="w-5 h-5 mr-2" />
// 							Available Times
// 						</CardTitle>
// 						{selectedDate && (
// 							<p className="text-sm text-muted-foreground">
// 								{selectedDate.toLocaleDateString("en-US", {
// 									weekday: "long",
// 									month: "long",
// 									day: "numeric",
// 									year: "numeric",
// 								})}
// 							</p>
// 						)}
// 					</CardHeader>
// 					<CardContent>
// 						{!selectedDate ? (
// 							<div className="text-center py-12 text-muted-foreground">
// 								<Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
// 								<p className="text-lg font-medium mb-2">Select a Date First</p>
// 								<p className="text-sm">Choose a date from the calendar to see available time slots</p>
// 							</div>
// 						) : (
// 							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
// 								{timeSlots.map((time) => {
// 									const isAvailable = isSlotAvailable(time);
// 									const isSelected = selectedTime === time;

// 									return (
// 										<Button
// 											key={time}
// 											variant={isSelected ? "default" : "outline"}
// 											size="sm"
// 											disabled={!isAvailable}
// 											onClick={() => handleTimeSelect(time)}
// 											className={`relative h-12 text-sm font-medium transition-all duration-200 ${
// 												!isAvailable ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
// 											} ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
// 										>
// 											<span className="flex items-center justify-center w-full">
// 												{time}
// 												{!isAvailable && (
// 													<Badge variant="destructive" className="ml-2 text-xs px-1 py-0">
// 														Booked
// 													</Badge>
// 												)}
// 											</span>
// 										</Button>
// 									);
// 								})}
// 							</div>
// 						)}
// 					</CardContent>
// 				</Card>
// 			</div>

// 			{/* Confirmation */}
// 			{selectedDate && selectedTime && (
// 				<div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl">
// 					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// 						<div className="space-y-1">
// 							<p className="text-lg font-semibold text-foreground">Selected Appointment</p>
// 							<p className="text-muted-foreground">
// 								{selectedDate.toLocaleDateString("en-US", {
// 									weekday: "long",
// 									year: "numeric",
// 									month: "long",
// 									day: "numeric",
// 								})} at {selectedTime}
// 							</p>
// 							{serviceDuration && (
// 								<p className="text-sm text-muted-foreground">Duration: {serviceDuration} minutes</p>
// 							)}
// 						</div>
// 						<Button
// 							onClick={handleSubmit}
// 							size="lg"
// 							className="w-full sm:w-auto min-w-[140px] h-12"
// 							disabled={!selectedDate || !selectedTime}
// 						>
// 							Confirm Time
// 						</Button>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
