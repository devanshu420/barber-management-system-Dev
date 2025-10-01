import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { Navbar } from "@/components/navbar"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <AdminDashboard />
      </main>
    </div>
  )
}
