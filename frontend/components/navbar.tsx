"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { CalendarDays, LogOut, Menu, User, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    ...(user
      ? [
          { name: "Create Event", href: "/events/create" },
          { name: "My Bookings", href: "/dashboard" },
        ]
      : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="text-xl font-heading font-bold">
            <span className="text-primary">Event</span> Pulse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{user.name || user.email}</span>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-secondary ${
                    pathname === item.href ? "bg-secondary text-primary" : "text-muted-foreground"
                  }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-border pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={closeMenu}>
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={closeMenu}>
                    <Button className="w-full justify-start">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

