import { BarberDashboard } from "@/components/dashboard/barber-dashboard"
import { Navbar } from "@/components/navbar"

export default function BarberDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <BarberDashboard />
      </main>
    </div>
  )
}
