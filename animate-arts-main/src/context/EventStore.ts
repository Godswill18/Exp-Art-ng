import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  ticketType: string;
  price: number;
  image?: string;
  isActive?: boolean;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;

  // CRUD actions
  fetchEvents: () => Promise<void>;
  fetchEventsUser: () => Promise<void>;
  fetchEventById: (id: string) => Promise<Event | null>;
  createEvent: (formData: FormData) => Promise<boolean>;
  updateEvent: (id: string, formData: FormData) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  selectedEvent?: Event | null;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/";

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      loading: false,
      error: null,

      // Get all events
      fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}api/events/get-events`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            set({ events: data.events, loading: false });
          } else {
            set({ error: data.message || "Failed to fetch events", loading: false });
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Network error",
            loading: false,
          });
        }
      },

      fetchEventsUser: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}api/events/get-user-events`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            set({ events: data.events, loading: false });
          } else {
            set({ error: data.message || "Failed to fetch events", loading: false });
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Network error",
            loading: false,
          });
        }
      },

      // Get single event by ID
      fetchEventById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}api/events/get-event/${id}`, {
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            set({ loading: false });
            return data.event;
          } else {
            set({ error: data.message || "Failed to fetch event", loading: false });
            return null;
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Network error",
            loading: false,
          });
          return null;
        }
      },

      // Create event
      createEvent: async (formData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}api/events/create-event`, {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            // Add new event to state
            set({ events: [data.event, ...get().events], loading: false });
            return true;
          } else {
            set({ error: data.message || "Failed to create event", loading: false });
            return false;
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Network error",
            loading: false,
          });
          return false;
        }
      },

      // Update event
      updateEvent: async (id, formData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}api/events/update-event/${id}`, {
            method: "PUT",
            body: formData,
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            // Update event in state
            set({
              events: get().events.map((event) =>
                event._id === id ? data.event : event
              ),
              loading: false,
            });
            return true;
          } else {
            set({ error: data.message || "Failed to update event", loading: false });
            return false;
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Network error",
            loading: false,
          });
          return false;
        }
      },

      // Delete event
      deleteEvent: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}api/events/delete-event/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) {
            // Remove from state
            set({
              events: get().events.filter((event) => event._id !== id),
              loading: false,
            });

               toast.success("Event deleted successfully",{
                position: "top-center"});

            return true;
          } else {
              toast.error("Failed to delete event",{
                position: "top-center"});

            const data = await res.json();
            set({ error: data.message || "Failed to delete event", loading: false });
            
            return false;
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Network error",
            loading: false,
          });
          return false;
        }
      },
    }),
    {
      name: "event-storage", // optional persistence
    }
  )
);
