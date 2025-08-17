import React, { useEffect, useState } from "react";
import { useGalleryStore } from "../store/useGalleryStore";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Gallery() {
  const { gallery, fetchGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem, loading } =
    useGalleryStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    image: null as File | null,
    description: "",
  });

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleCreateSubmit = async () => {
    if (!galleryForm.title || !galleryForm.description || !galleryForm.image) {
      toast.error("Please fill in all fields and upload an image",{
        position: "top-center"
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", galleryForm.title);
    formData.append("description", galleryForm.description);
    if (galleryForm.image) {
      formData.append("image", galleryForm.image);
    }

    await createGalleryItem(formData);
    setGalleryForm({ title: "", image: null, description: "" });
    setShowCreateModal(false);
    setImagePreview(null);
       toast.success("You have successfully added an image to your gallery",{
        position: "top-center"
      });
  };

  const handleEditSubmit = async () => {
  try {
    if (!selectedItem?.title || !selectedItem?.description) {
      toast.error("Please fill in all fields",{
        position: "top-center"
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", selectedItem.title);
    formData.append("description", selectedItem.description);
    if (galleryForm.image) {
      formData.append("image", galleryForm.image);
    }

    await updateGalleryItem(selectedItem._id, formData);
    
    // Refresh the gallery data
    await fetchGallery();
    
    setShowEditModal(false);
    setImagePreview(null);
    setGalleryForm({ title: "", image: null, description: "" });
       toast.success("You have successfully updated your gallery",{
        position: "top-center"
      });
  } catch (error) {
    console.error("Failed to update gallery item:", error);
        toast.error("Failed to update gallery item. Please try again.",{
        position: "top-center"
      });
  }
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryForm({ ...galleryForm, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 min-h-screen p-6">
      {/* Header and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Empty State */}
      {!loading && gallery?.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No gallery items</h3>
            <p className="mt-1 text-gray-500">
              Get started by adding your first gallery item.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Gallery Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && gallery?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {gallery?.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_IMAGE_URL}${item.image}`}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Add Gallery Item">
          <div className="space-y-4 text-black">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                value={galleryForm.title}
                onChange={(e) =>
                  setGalleryForm({ ...galleryForm, title: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded w-full"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded border"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Description"
                value={galleryForm.description}
                onChange={(e) =>
                  setGalleryForm({ ...galleryForm, description: e.target.value })
                }
                className="border p-2 rounded w-full"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setGalleryForm({ title: "", image: null, description: "" });
                  setImagePreview(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Item
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Gallery Item">
          <div className="space-y-4 text-black">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={selectedItem.title}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, title: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded w-full"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded border"
                />
              ) : (
                <img
                  src={`http://localhost:5000/${selectedItem.image}`}
                  alt={selectedItem.title}
                  className="mt-2 w-full h-40 object-cover rounded border"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, description: e.target.value })
                }
                className="border p-2 rounded w-full"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setImagePreview(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedItem && (
        <Modal onClose={() => setShowDeleteModal(false)} title="Delete Item">
          <div className="space-y-4 text-black">
            <p className="text-gray-700">
              Are you sure you want to delete this gallery item?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteGalleryItem(selectedItem._id);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Reusable Modal Component
function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {title && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}