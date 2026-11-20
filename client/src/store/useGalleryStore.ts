import { create } from "zustand";
import { apiRequest, getErrorMessage } from "@/lib/api";
import type { GalleryItem } from "@/types/api";

export type { GalleryItem };

interface GalleryState {
  gallery: GalleryItem[];
  loading: boolean;
  error: string | null;
  fetchGalleryUser: () => Promise<void>;
}

export const useGalleryStore = create<GalleryState>()((set) => ({
  gallery: [],
  loading: true,
  error: null,

  fetchGalleryUser: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<{ galleryPosts?: GalleryItem[] }>("/api/gallery/get-all-posts-user");
      set({ gallery: data?.galleryPosts ?? [], loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err, "Failed to load gallery"), loading: false });
    }
  },
}));
