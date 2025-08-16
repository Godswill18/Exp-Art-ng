import { toast } from "sonner";
import { create } from "zustand";

export interface GalleryItem {
  _id?: string;
  title: string;
  image: string;
  description: string;
}

interface GalleryState {
  gallery: GalleryItem[];
  loading: boolean;
  fetchGallery: () => Promise<void>;
  fetchGalleryUser: () => Promise<void>;
  createGalleryItem: (formData: FormData) => Promise<void>;
  updateGalleryItem: (id: string, formData: FormData) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/";

export const useGalleryStore = create<GalleryState>((set) => ({
  gallery: [],
  loading: false,

  fetchGallery: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}api/gallery/get-all-posts`, {
          method: "GET",
            credentials: "include",
      });
      const data = await res.json();
      set({ gallery: data.galleryPosts, loading: false });
    } catch (err) {
      console.error("Failed to fetch gallery", err);
      set({ loading: false });
    }
  },

  fetchGalleryUser: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}api/gallery/get-all-posts`, {
          method: "GET",
            credentials: "include",
      });
      const data = await res.json();
      set({ gallery: data.galleryPosts, loading: false });
    } catch (err) {
      console.error("Failed to fetch gallery", err);
      set({ loading: false });
    }
  },

  createGalleryItem: async (formData) => {
    try {
      const res = await fetch(`${API_URL}api/gallery/upload-post`, {
        method: "POST",
        body: formData,
        credentials: "include", // must be FormData, no JSON.stringify here
      });

      if (!res.ok) throw new Error("Failed to create gallery post");

      const data = await res.json();
      set((state) => ({
        gallery: [data.galleryPost, ...state.gallery],
      }));
    } catch (err) {
      console.error(err);
    }
  },

updateGalleryItem: async (id, formData) => {
  try {
    const res = await fetch(`${API_URL}api/gallery/update-post/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to update gallery post");

    const data = await res.json();
    set((state) => ({
      gallery: state.gallery.map(item => 
        item._id === id ? { 
          ...item, // Keep existing properties
          ...data.updatedPost, // Apply updates
          image: data.updatedPost?.image || item.image // Fallback to existing image if not provided
        } : item
      ),
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
},

  deleteGalleryItem: async (id) => {
    try {
      const res = await fetch(`${API_URL}api/gallery/delete-post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok){

          throw new Error("Failed to delete gallery post");
      }else{
        toast.success("Post has been deleted successfully",{
                position: "top-center"});
      }

      set((state) => ({
        gallery: state.gallery.filter((item) => item._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
