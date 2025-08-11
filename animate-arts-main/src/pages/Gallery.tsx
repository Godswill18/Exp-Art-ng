import React, { useState } from "react";
import { mockGallery } from "../data/mockData";
import { GalleryItem } from "../types";
import { Edit2, Plus, Trash2 } from "lucide-react";

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>(mockGallery);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    image: "",
    description: "",
  });

  const showNotification = (type: "success" | "error", message: string) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleCreateGalleryItem = () => {
    if (galleryForm.title && galleryForm.description) {
      const newItem: GalleryItem = {
        id: `G${String(gallery.length + 1).padStart(3, "0")}`,
        title: galleryForm.title,
        image:
          galleryForm.image ||
          "https://via.placeholder.com/300x200?text=No+Image",
        description: galleryForm.description,
      };
      setGallery([...gallery, newItem]);
      setGalleryForm({ title: "", image: "", description: "" });
      showNotification("success", "Gallery item added successfully!");
    } else {
      showNotification("error", "Please fill in all required fields");
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGallery(gallery.filter((item) => item.id !== id));
    showNotification("success", "Gallery item deleted successfully!");
  };

  return (
    <div>
      {/* Create Gallery Item Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200 text-black">
        <div className="flex items-center mb-6">
          <Plus className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold ">
            Add Gallery Item
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={galleryForm.title}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter title (max 100 characters)"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={galleryForm.image}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, image: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={galleryForm.description}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter description (max 500 characters)"
              maxLength={500}
            />
          </div>
        </div>
        <button
          onClick={handleCreateGalleryItem}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add to Gallery
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Gallery Items ({gallery.length})
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-end space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGalleryItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
