import { create } from 'zustand';
import { toast } from 'sonner';

interface EventDay {
  _id?: string;
  day: string;
  date: string;
  activities: string;
  description?: string;
}

interface EventFlowState {
  eventDays: EventDay[];
  loading: boolean;
  error: string | null;
  fetchEventDays: () => Promise<void>;
  fetchEventDaysUser: () => Promise<void>;
  createEventDay: (eventData: Omit<EventDay, '_id'>) => Promise<void>;
  updateEventDay: (id: string, eventData: Partial<EventDay>) => Promise<void>;
  deleteEventDay: (id: string) => Promise<void>;
  getEventDayById: (id: string) => Promise<EventDay | null>;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/';

export const useEventFlowStore = create<EventFlowState>((set) => ({
  eventDays: [],
  loading: false,
  error: null,

  fetchEventDays: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/schedule/get-all-schedule`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event days');
      }

      const data = await response.json();
    //   console.log(eventDays)
      set({ eventDays: data.schedules || [], loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to load event days',{
        position: "top-center"
      });
    }
  },

  fetchEventDaysUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/schedule/get-all-schedule-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event days');
      }

      const data = await response.json();
    //   console.log(eventDays)
      set({ eventDays: data.schedules || [], loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to load event days',{
        position: "top-center"
      });
    }
  },

  createEventDay: async (eventData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/schedule/create-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create event day');
      }

      const newEventDay = await response.json();
      set((state) => ({
        eventDays: [...state.eventDays, newEventDay],
        loading: false
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to create event day');
    }
  },

  updateEventDay: async (id, eventData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/schedule/update-schedule/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update event day');
      }

      const updatedEventDay = await response.json();
      set((state) => ({
        eventDays: state.eventDays.map(day => 
          day._id === id ? updatedEventDay : day
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to update event day');
    }
  },

  deleteEventDay: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/schedule/delete-schedule/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event day');
      }

      set((state) => ({
        eventDays: state.eventDays.filter(day => day._id !== id),
        loading: false
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to delete event day');
    }
  },

  getEventDayById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/schedule/get-schedule/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event day');
      }

      const data = await response.json();
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to fetch event day details');
      return null;
    }
  }
}));