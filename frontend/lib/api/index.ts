// Base URLs for each service
const USER_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}:${process.env.NEXT_PUBLIC_USER_SERVICE_PORT}`;
const BOOKING_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}:${process.env.NEXT_PUBLIC_BOOKING_SERVICE_PORT}`;
const EVENT_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}:${process.env.NEXT_PUBLIC_EVENT_SERVICE_PORT}`;
const NOTIFICATION_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}:${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_PORT}`;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let token = null;
  
    // Prevent errors if running on server-side
    if (typeof window !== "undefined") {
      token = localStorage.getItem('token');
    }
  
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
  
    const response = await fetch(url, {
      ...options,
      headers,
    });
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }
  
    return response.json();
  }
  

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    fetchWithAuth(`${USER_API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  register: (name: string, email: string, password: string) => 
    fetchWithAuth(`${USER_API}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
};

// Events API
export const eventsAPI = {
  getAll: () => fetchWithAuth(`${EVENT_API}/events`),
  
  getById: (id: string) => fetchWithAuth(`${EVENT_API}/events/${id}`),
  
  create: (eventData: any) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Unauthorized");
  
    return fetchWithAuth(`${EVENT_API}/events`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },  // ✅ Added token here
      body: JSON.stringify(eventData),
    });
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: () => fetchWithAuth(`${BOOKING_API}/bookings`),
  
  create: (bookingData: any) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Unauthorized");
  
    return fetchWithAuth(`${BOOKING_API}/bookings`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },  // ✅ Added token here
      body: JSON.stringify(bookingData),
    });
  },
};