import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { contactsService } from "@/services/contactsService";
import type { ContactMessage } from "@/types/api";

interface ContactState {
  message: ContactMessage[];
  loading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactState>()((set) => ({
  message: [],
  loading: false,
  error: null,

  fetchMessages: async () => {
    set({ loading: true, error: null });
    try {
      const data = await contactsService.list();
      set({ message: data?.contacts ?? [], loading: false });
    } catch (err) {
      set({ message: [], loading: false, error: getErrorMessage(err, "Failed to fetch messages") });
    }
  },

  deleteMessage: async (id) => {
    set({ loading: true, error: null });
    try {
      await contactsService.remove(id);
      set((state) => ({ message: state.message.filter((m) => m._id !== id), loading: false }));
      toast.success("Message deleted successfully", { position: "top-center" });
    } catch (err) {
      const message = getErrorMessage(err, "Failed to delete message");
      set({ error: message, loading: false });
      toast.error(message, { position: "top-center" });
    }
  },
}));
