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
  messages: ContactMessage[];
  loading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  // markAsRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/';

export const useContactStore = create<ContactState>((set) => ({
  messages: [],
  loading: false,
  error: null,

  fetchMessages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/contact/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      set({ messages: data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to load messages',{
        position: "top-center"
      });
    }
  },

  // markAsRead: async (id) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const response = await fetch(`${API_URL}api/contact/mark-read/${id}`, {
  //       method: 'PUT',
  //       credentials: 'include',
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to mark message as read');
  //     }

  //     set((state) => ({
  //       messages: state.messages.map(msg => 
  //         msg._id === id ? { ...msg, isRead: true } : msg
  //       ),
  //       loading: false
  //     }));
  //     toast.success('Message marked as read');
  //   } catch (err) {
  //     set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
  //     toast.error('Failed to update message status');
  //   }
  // },

  deleteMessage: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}api/contact/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      set((state) => ({
        messages: state.messages.filter(msg => msg._id !== id),
        loading: false
      }));
      toast.success('Message deleted successfully');
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
      toast.error('Failed to delete message',{
         position: "top-center"
      });
    }
  }
}));