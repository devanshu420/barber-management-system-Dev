// app/layout.jsx (Server Component)
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import AuthProviderWrapper from "@/contexts/AuthProviderWrapper"

export const metadata = {
  title: "Barber Booking",
  description: "Created by Devanshu",
  // manifest: "/manifest.json",
  // themeColor: "#1F2937"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
        <Analytics />
      </body>
    </html>
  )
}



// "use client"  // important for client-side components like useAuth

// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
// import { Suspense } from "react"
// import "leaflet/dist/leaflet.css"

// import { AuthProvider } from "@/contexts/auth-context" // import your provider
// import "./globals.css"

// export const metadata = {
//   title: "Barber Booking",
//   description: "Created by Devanshu",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
//         <AuthProvider>
//           <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
//         </AuthProvider>
//         <Analytics />
//       </body>
//     </html>
//   )
// }
