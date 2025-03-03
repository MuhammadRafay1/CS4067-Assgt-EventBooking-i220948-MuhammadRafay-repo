import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Ticket, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                <span className="text-primary glow">Event</span> Pulse
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover and book the hottest events in your area. From concerts to workshops, find your next
                experience.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/events">
                <Button size="lg" className="animate-pulse-glow">
                  Browse Events
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 items-center">
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 bg-secondary">
              <Calendar className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-heading font-bold">Find Events</h3>
              <p className="text-center text-muted-foreground">
                Browse through hundreds of events happening near you and around the world.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 bg-secondary">
              <Ticket className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-heading font-bold">Book Tickets</h3>
              <p className="text-center text-muted-foreground">
                Secure your spot with our easy booking system. Get tickets in seconds.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 bg-secondary">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-heading font-bold">Host Events</h3>
              <p className="text-center text-muted-foreground">
                Create and manage your own events. Reach a wider audience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

