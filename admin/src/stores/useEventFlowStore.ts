import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { scheduleService } from "@/services/scheduleService";
import type { EventDay } from "@/types/api";

export type { EventDay };

interface EventFlowState {
  eventDays: EventDay[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchEventDays: () => Promise<void>;
  /** Mutations throw ApiError on failure so callers never report false success. */
  createEventDay: (eventData: Omit<EventDay, "_id">) => Promise<void>;
  updateEventDay: (id: string, eventData: Partial<EventDay>) => Promise<void>;
  deleteEventDay: (id: string) => Promise<void>;
  /** The API wraps the record: `{ schedule: EventDay }`. */
  getEventDayById: (id: string) => Promise<{ schedule: EventDay } | null>;
}

export const useEventFlowStore = create<EventFlowState>()((set, get) => {
  const mutate = async (fn: () => Promise<void>) => {
    if (get().saving) throw new Error("Another schedule request is already in progress.");
    set({ saving: true, error: null });
    try {
      await fn();
    } catch (err) {
      set({ error: getErrorMessage(err, "Schedule request failed") });
      throw err;
    } finally {
      set({ saving: false });
    }
  };

  return {
    eventDays: [],
    loading: true,
    saving: false,
    error: null,

    fetchEventDays: async () => {
      set({ loading: true, error: null });
      try {
        const data = await scheduleService.list();
        set({ eventDays: data?.schedules ?? [], loading: false });
      } catch (err) {
        const message = getErrorMessage(err, "Failed to load event days");
        set({ error: message, loading: false });
        toast.error(message, { position: "top-center" });
      }
    },

    createEventDay: (eventData) =>
      mutate(async () => {
        const created = await scheduleService.create(eventData);
        set((state) => ({ eventDays: [...state.eventDays, created] }));
      }),

    updateEventDay: (id, eventData) =>
      mutate(async () => {
        const updated = await scheduleService.update(id, eventData);
        set((state) => ({ eventDays: state.eventDays.map((d) => (d._id === id ? updated : d)) }));
      }),

    deleteEventDay: (id) =>
      mutate(async () => {
        await scheduleService.remove(id);
        set((state) => ({ eventDays: state.eventDays.filter((d) => d._id !== id) }));
      }),

    getEventDayById: async (id) => {
      try {
        return await scheduleService.get(id);
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to fetch event day details"), { position: "top-center" });
        return null;
      }
    },
  };
});
