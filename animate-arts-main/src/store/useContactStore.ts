import { create } from 'zustand';
import { toast } from 'sonner';

interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
  isRead?: boolean;
}

interface ContactState {
  message: ContactMessage[];
  loading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  createMessage: (messageData: Omit<ContactMessage, '_id' | 'createdAt' | 'isRead'>) => Promise<void>;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/';
// const API_URL = "/api";

export const useContactStore = create<ContactState>((set) => ({
  message: [],
  loading: false,
  error: null,

fetchMessages: async () => {
  set({ loading: true, error: null });
  try {
    const response = await fetch(`${API_URL}/contacts/get-all-contacts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch messages');
    const data = await response.json();

    // Backend sends { contacts: [...] }
    set({ message: data?.contacts || [] });
  } catch (error) {
    console.error(error);
    set({ message: [] });
  } finally {
    set({ loading: false });
  }
},


  deleteMessage: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/contacts/delete-contact/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete message');
      
      set((state) => ({
        message: state.message.filter(msg => msg._id !== id),
        loading: false
      }));
      toast.success('Message deleted successfully',{
        position: "top-center"
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to delete message', { position: "top-center" });
    }
  },

createMessage: async (formData) => {
  set({ loading: true });
  try {
    const response = await fetch(`${API_URL}/contacts/create-contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to create message");

    const data = await response.json();
    const newContact = data?.contacts; // <-- extract the contact object

    set((state) => ({
      message: [newContact, ...state.message], // <-- store contact, not entire response
      loading: false,
    }));

    return newContact; // <-- return to caller
  } catch (error) {
    console.error("Create message failed:", error);
    set({ loading: false });
    throw error;
  }
},

}));