import React, { useState } from "react";
import { mockEvents } from "../data/mockData";
import { Event } from "../types";
import { Edit2, Plus, Trash2 } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const showNotification = (type: "success" | "error", message: string) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleCreateEvent = () => {
    if (eventForm.title && eventForm.description && eventForm.price) {
      const newEvent: Event = {
        id: `EV${String(events.length + 1).padStart(3, "0")}`,
        title: eventForm.title,
        description: eventForm.description,
        price: parseFloat(eventForm.price),
        image:
          eventForm.image ||
          "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
      };
      setEvents([...events, newEvent]);
      setEventForm({ title: "", description: "", price: "", image: "" });
      showNotification("success", "Event created successfully!");
    } else {
      showNotification("error", "Please fill in all required fields");
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    showNotification("success", "Event deleted successfully!");
  };

  return (
    <div>
      {/* Create Event Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200 text-black">
        <div className="flex items-center mb-6">
          <Plus className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Event
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter event title (max 100 characters)"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={eventForm.price}
              onChange={(e) =>
                setEventForm({ ...eventForm, price: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="99.99"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter event description (max 500 characters)"
              maxLength={500}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={eventForm.image}
              onChange={(e) =>
                setEventForm({ ...eventForm, image: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        <button
          onClick={handleCreateEvent}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Events ({events.length})
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    ${event.price.toFixed(2)}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
