import { apiRequest } from "@/lib/api";
import type { GalleryItem } from "@/types/api";

const enc = encodeURIComponent;

export const galleryService = {
  list: () => apiRequest<{ galleryPosts?: GalleryItem[] }>("/api/gallery/get-all-posts"),
  create: (formData: FormData) =>
    apiRequest<{ galleryPost: GalleryItem }>("/api/gallery/upload-post", { method: "POST", formData }),
  update: (id: string, formData: FormData) =>
    apiRequest<{ updatedPost?: GalleryItem }>(`/api/gallery/update-post/${enc(id)}`, {
      method: "PUT",
      formData,
    }),
  remove: (id: string) => apiRequest(`/api/gallery/delete-post/${enc(id)}`, { method: "DELETE" }),
};
