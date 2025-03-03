"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { bookingsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Loader2, Ticket, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

type Booking = {
  id: string;
  event: {
    id: string;
    name: string;
    date: string;
    location?: string;
  };
  tickets: number;
  createdAt: string;
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Redirect if not logged in
  if (!isLoading && !user) {
    redirect("/auth/login");
  }

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const data = await bookingsAPI.getAll(); // ✅ Fetch bookings from backend
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load bookings. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, toast]);

  

  const upcomingBookings = bookings.filter((booking) => new Date(booking.event.date) > new Date());

  const pastBookings = bookings.filter((booking) => new Date(booking.event.date) <= new Date());

  if (isLoading || loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your event bookings</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground mb-6">You don't have any upcoming event bookings.</p>
                <Button asChild>
                  <a href="/events">Browse Events</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="border-border">
                    <CardHeader className="bg-secondary">
                      <CardTitle className="font-heading">{booking.event.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(booking.event.date)}
                      </CardDescription>
                      {booking.event.location && <CardDescription>{booking.event.location}</CardDescription>}
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}
                          </span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          //onClick={() => cancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                        >
                          {cancellingId === booking.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No past bookings</h3>
                <p className="text-muted-foreground mb-6">You don't have any past event bookings.</p>
                <Button asChild>
                  <a href="/events">Browse Events</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="border-border">
                    <CardHeader className="bg-secondary">
                      <CardTitle className="font-heading">{booking.event.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(booking.event.date)}
                      </CardDescription>
                      {booking.event.location && <CardDescription>{booking.event.location}</CardDescription>}
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
