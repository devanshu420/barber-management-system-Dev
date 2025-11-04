import { BookingFlow } from "@/components/booking/booking-flow"
import { Navbar } from "@/components/navbar"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="">
        <BookingFlow />
      </main>
    </div>
  )
}