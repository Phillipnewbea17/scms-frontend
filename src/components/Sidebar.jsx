import React from "react";
import {
  FiHome,
  FiCheckSquare,
  FiFolder,
  FiVolume2,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { PiCakeDuotone } from "react-icons/pi";
import { GiHeartWings } from "react-icons/gi";
import "./Sidebar.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: FiHome },
  { key: "verification", label: "Document Verification", icon: FiCheckSquare },
  { key: "records", label: "Records", icon: FiFolder },
  { key: "announcements", label: "Announcements", icon: FiVolume2 },
  { key: "birthday", label: "Birthday List", icon: PiCakeDuotone },
];

/**
 * Responsive behavior:
 * - Desktop (>1024px): full sidebar, always visible, static in the layout.
 * - Tablet (768-1024px): collapses to an icon-only rail (labels hidden, shown as tooltips via title attr).
 * - Mobile (<768px): becomes an off-canvas drawer, hidden by default and slid in
 *   over the content when `isOpen` is true. Pass a hamburger button in your
 *   top bar that calls `onToggle` / sets `isOpen` to control it.
 */
export default function Sidebar({
  activeKey = "birthday",
  onNavigate,
  onLogout,
  isOpen = false,
  onClose,
}) {
  const handleNavigate = (key) => {
    onNavigate && onNavigate(key);
    // auto-close the drawer on mobile after picking a page
    onClose && onClose();
  };

  return (
    <>
      {/* Dark overlay behind the drawer on mobile, click to dismiss */}
      <div
        className={`sidebar-overlay${isOpen ? " visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">
            <GiHeartWings />
          </span>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">Senior Citizen</span>
            <span className="sidebar-logo-subtitle">Management System</span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              title={label}
              className={`sidebar-nav-item${key === activeKey ? " active" : ""}`}
              onClick={() => handleNavigate(key)}
            >
              <Icon className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" title="Logout" className="sidebar-logout" onClick={onLogout}>
            <FiLogOut className="sidebar-nav-icon" />
            <span className="sidebar-nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
