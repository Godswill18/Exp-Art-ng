import { create } from "zustand";
import { getErrorMessage } from "@/lib/api";
import { galleryService } from "@/services/galleryService";
import type { GalleryItem } from "@/types/api";

interface GalleryState {
  gallery: GalleryItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchGallery: () => Promise<void>;
  /** Mutations throw ApiError on failure so callers never report false success. */
  createGalleryItem: (formData: FormData) => Promise<void>;
  updateGalleryItem: (id: string, formData: FormData) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryState>()((set, get) => {
  const mutate = async (fn: () => Promise<void>) => {
    if (get().saving) throw new Error("Another gallery request is already in progress.");
    set({ saving: true, error: null });
    try {
      await fn();
    } catch (err) {
      set({ error: getErrorMessage(err, "Gallery request failed") });
      throw err;
    } finally {
      set({ saving: false });
    }
  };

  return {
    gallery: [],
    loading: true,
    saving: false,
    error: null,

    fetchGallery: async () => {
      set({ loading: true, error: null });
      try {
        const data = await galleryService.list();
        set({ gallery: data?.galleryPosts ?? [], loading: false });
      } catch (err) {
        set({ error: getErrorMessage(err, "Failed to load gallery"), loading: false });
      }
    },

    createGalleryItem: (formData) =>
      mutate(async () => {
        const data = await galleryService.create(formData);
        set((state) => ({ gallery: [data.galleryPost, ...state.gallery] }));
      }),

    updateGalleryItem: (id, formData) =>
      mutate(async () => {
        const data = await galleryService.update(id, formData);
        set((state) => ({
          gallery: state.gallery.map((item) =>
            item._id === id
              ? { ...item, ...data.updatedPost, image: data.updatedPost?.image || item.image }
              : item
          ),
        }));
      }),

    deleteGalleryItem: (id) =>
      mutate(async () => {
        await galleryService.remove(id);
        set((state) => ({ gallery: state.gallery.filter((item) => item._id !== id) }));
      }),
  };
});
