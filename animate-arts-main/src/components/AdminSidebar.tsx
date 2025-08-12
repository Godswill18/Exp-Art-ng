import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  CalendarIcon,
  PhotoIcon,
  ArrowRightEndOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon },
    { name: "Transactions", path: "/admin/transactions", icon: CreditCardIcon },
    { name: "Events", path: "/admin/events", icon: CalendarIcon },
    { name: "Gallery", path: "/admin/gallery", icon: PhotoIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-lg min-h-screen flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600"> EXP ART</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-red-600 hover:bg-red-100"
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex lg:hidden transition-all duration-300 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? "bg-opacity-50" : "bg-opacity-0"
          }`}
          onClick={onClose}
        ></div>

        {/* Drawer */}
        <div
          className={`relative w-64 bg-white shadow-lg flex flex-col min-h-screen z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {/* <h1 className="text-xl font-bold text-blue-600">My App</h1> */}
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={name}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-red-600 hover:bg-red-100"
            >
              <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
