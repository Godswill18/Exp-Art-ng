import { create } from "zustand";
import { apiRequest, getErrorMessage } from "@/lib/api";

export interface NewContactMessage {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface ContactState {
  /** true while a message is being submitted (guards against double submit) */
  submitting: boolean;
  error: string | null;
  /** Resolves only once the API has saved the message; throws ApiError otherwise. */
  createMessage: (messageData: NewContactMessage, extra?: Record<string, unknown>) => Promise<void>;
}

export const useContactStore = create<ContactState>()((set, get) => ({
  submitting: false,
  error: null,

  createMessage: async (messageData, extra = {}) => {
    if (get().submitting) throw new Error("A message is already being sent.");
    set({ submitting: true, error: null });
    try {
      await apiRequest("/api/contacts/create-contact", {
        method: "POST",
        json: { ...messageData, ...extra },
      });
      set({ submitting: false });
    } catch (err) {
      set({ submitting: false, error: getErrorMessage(err, "Failed to send message") });
      throw err;
    }
  },
}));
