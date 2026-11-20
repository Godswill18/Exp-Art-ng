import { create } from "zustand";
import { apiRequest, getErrorMessage } from "@/lib/api";
import type { EventDay } from "@/types/api";

export type { EventDay };

interface EventFlowState {
  eventDays: EventDay[];
  loading: boolean;
  error: string | null;
  fetchEventDaysUser: () => Promise<void>;
}

export const useEventFlowStore = create<EventFlowState>()((set) => ({
  eventDays: [],
  loading: true,
  error: null,

  fetchEventDaysUser: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<{ schedules?: EventDay[] }>("/api/schedule/get-all-schedule-user");
      set({ eventDays: data?.schedules ?? [], loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err, "Failed to load the event schedule"), loading: false });
    }
  },
}));
