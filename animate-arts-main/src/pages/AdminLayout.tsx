import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="">{children}</main>
      </div>
    </div>
  );
}
