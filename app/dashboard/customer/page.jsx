import { CustomerDashboard } from "@/components/dashboard/customer-dashboard"
import { Navbar } from "@/components/navbar"

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <CustomerDashboard />
      </main>
    </div>
  )
}