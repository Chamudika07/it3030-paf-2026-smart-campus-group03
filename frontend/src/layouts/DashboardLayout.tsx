import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Navbar } from "../components/navigation/Navbar";

export function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Navbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

