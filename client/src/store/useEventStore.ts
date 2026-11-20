import { create } from "zustand";
import { apiRequest, getErrorMessage } from "@/lib/api";
import type { EventItem } from "@/types/api";

interface EventState {
  events: EventItem[];
  /** true until the first fetch settles, so the page never flashes an empty state */
  loading: boolean;
  error: string | null;
  fetchEventsUser: () => Promise<void>;
}

export const useEventStore = create<EventState>()((set) => ({
  events: [],
  loading: true,
  error: null,

  fetchEventsUser: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<{ events?: EventItem[] }>("/api/events/get-user-events");
      set({ events: data?.events ?? [], loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err, "Failed to fetch events"), loading: false });
    }
  },
}));
