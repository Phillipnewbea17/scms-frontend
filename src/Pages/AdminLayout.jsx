import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminLayout.css";

/* Maps sidebar nav keys <-> real URL paths */
const PATH_TO_KEY = {
  "/dashboard": "dashboard",
  "/document-verification": "verification",
  "/records": "records",
  "/announcements": "announcements",
  "/birthday-list": "birthday",
};

const KEY_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_KEY).map(([path, key]) => [key, path])
);

export default function AdminLayout({ onLogout, adminName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeKey = PATH_TO_KEY[location.pathname] || "dashboard";

  const handleNavigate = (key) => {
    navigate(KEY_TO_PATH[key] || "/dashboard");
  };

  return (
    <div className="admin-layout">
      <Sidebar
        activeKey={activeKey}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-layout-content">
        <Header
          adminName={adminName}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />

        <main className="admin-layout-main">
          {/* The matched child route (Dashboard, Records, etc.) renders here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
