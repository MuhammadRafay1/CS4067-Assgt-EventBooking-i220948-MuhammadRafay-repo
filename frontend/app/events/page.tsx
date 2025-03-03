"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Loader2, MapPin, Ticket } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { eventsAPI, bookingsAPI } from "@/lib/api";

type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  location?: string;
  availableTickets: number;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsAPI.getAll(); // ✅ Fetch events from backend
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const handleBookEvent = (event: Event) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book tickets",
        variant: "destructive",
      });
      return;
    }

    setBookingEvent(event);
    setTicketCount(1);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingEvent || !user) return;

    setIsBooking(true);

    try {
      await bookingsAPI.create({ event_id: bookingEvent.id, tickets: ticketCount }); // ✅ Send booking request

      toast({
        title: "Booking successful",
        description: `You have booked ${ticketCount} ticket${ticketCount > 1 ? "s" : ""} for ${bookingEvent.name}`,
      });

      // ✅ Update available tickets in the UI
      setEvents(
        events.map((event) =>
          event.id === bookingEvent.id ? { ...event, availableTickets: event.availableTickets - ticketCount } : event
        )
      );

      setBookingEvent(null);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading font-bold">Upcoming Events</h1>
          <p className="text-muted-foreground">Browse and book tickets for upcoming events</p>
        </div>

        {user && (
          <div className="flex justify-end">
            <Link href="/events/create">
              <Button>Create Event</Button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden border-border">
              <CardHeader className="bg-secondary">
                <CardTitle className="font-heading">{event.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.date)}
                </CardDescription>
                {event.location && (
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{event.availableTickets} tickets available</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleBookEvent(event)}
                  disabled={event.availableTickets === 0}
                  className="w-full"
                >
                  {event.availableTickets === 0 ? "Sold Out" : "Book Tickets"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Booking Modal */}
        {bookingEvent && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-border">
              <CardHeader>
                <CardTitle className="font-heading">Book Tickets</CardTitle>
                <CardDescription>
                  {bookingEvent.name} - {formatDate(bookingEvent.date)}
                </CardDescription>
              </CardHeader>
              <form onSubmit={submitBooking}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tickets">Number of Tickets</Label>
                    <Input
                      id="tickets"
                      type="number"
                      min={1}
                      max={bookingEvent.availableTickets}
                      value={ticketCount}
                      onChange={(e) => setTicketCount(Number.parseInt(e.target.value))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">{bookingEvent.availableTickets} tickets available</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setBookingEvent(null)} disabled={isBooking}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isBooking}>
                    {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Booking
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
