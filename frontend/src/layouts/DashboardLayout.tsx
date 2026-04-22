import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Navbar } from "../components/navigation/Navbar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:grid lg:grid-cols-[288px_minmax(0,1fr)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 px-4 py-4 lg:px-6 lg:py-6">
        <Navbar onToggleSidebar={() => setSidebarOpen((current) => !current)} />
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
