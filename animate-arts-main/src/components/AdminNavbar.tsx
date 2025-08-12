import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";

const AdminNavbar = ({ onMenuClick }) => {
     const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <header className="bg-white text-black px-6 py-3 shadow-md flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-600">Admin</h1>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>
    </header>
  );
};

export default AdminNavbar;
