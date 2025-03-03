import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Event Pulse | Book Amazing Events",
  description: "Find and book the hottest events in your area",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-background min-h-screen`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="py-6 border-t border-border bg-card">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Event Pulse. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Terms
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Privacy
                  </a>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'