import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { eventsService } from "@/services/eventsService";
import type { EventItem } from "@/types/api";

interface EventState {
  events: EventItem[];
  selectedEvent: EventItem | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<EventItem | null>;
  createEvent: (formData: FormData) => Promise<boolean>;
  updateEvent: (id: string, formData: FormData) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
}

export const useEventStore = create<EventState>()((set, get) => {
  /** One mutation at a time; failures set `error` and resolve false. */
  const mutate = async (fn: () => Promise<void>, failure: string): Promise<boolean> => {
    if (get().saving) return false;
    set({ saving: true, error: null });
    try {
      await fn();
      set({ saving: false });
      return true;
    } catch (err) {
      set({ error: getErrorMessage(err, failure), saving: false });
      return false;
    }
  };

  return {
    events: [],
    selectedEvent: null,
    loading: true,
    saving: false,
    error: null,

    fetchEvents: async () => {
      set({ loading: true, error: null });
      try {
        const data = await eventsService.list();
        set({ events: data?.events ?? [], loading: false });
      } catch (err) {
        set({ error: getErrorMessage(err, "Failed to fetch events"), loading: false });
      }
    },

    fetchEventById: async (id) => {
      try {
        const data = await eventsService.get(id);
        set({ selectedEvent: data.event });
        return data.event;
      } catch (err) {
        const message = getErrorMessage(err, "Failed to fetch event");
        set({ error: message });
        toast.error(message, { position: "top-center" });
        return null;
      }
    },

    createEvent: (formData) =>
      mutate(async () => {
        const data = await eventsService.create(formData);
        set({ events: [data.event, ...get().events] });
      }, "Failed to create event"),

    updateEvent: (id, formData) =>
      mutate(async () => {
        const data = await eventsService.update(id, formData);
        set({ events: get().events.map((e) => (e._id === id ? data.event : e)) });
      }, "Failed to update event"),

    deleteEvent: async (id) => {
      const ok = await mutate(async () => {
        await eventsService.remove(id);
        set({ events: get().events.filter((e) => e._id !== id) });
      }, "Failed to delete event");
      if (ok) toast.success("Event deleted successfully", { position: "top-center" });
      else toast.error(get().error ?? "Failed to delete event", { position: "top-center" });
      return ok;
    },
  };
});
