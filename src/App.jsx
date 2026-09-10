import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { logoutUser } from "./services/api";
import Login from "./Pages/Login";
import AdminLayout from "./Pages/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import DocumentVerification from "./Pages/DocumentVerification";
import Records from "./Pages/Records";
import Announcements from "./Pages/Announcements";
import BirthdayList from "./Pages/BirthdayList";

import "./index.css";

const AUTH_KEY = "scms_is_authenticated";
const NAME_KEY = "scms_admin_name";
const TOKEN_KEY = "scms_token";

/* Blocks a route unless the person is logged in, sending them to /login otherwise. */
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  // "Remember me" persists the session in localStorage; otherwise it's
  // just in-memory state and clears on refresh.
 const [isAuthenticated, setIsAuthenticated] = useState(
  () =>
    Boolean(localStorage.getItem(TOKEN_KEY)) ||
    Boolean(sessionStorage.getItem(TOKEN_KEY))
);
  const [adminName, setAdminName] = useState(
    () => localStorage.getItem(NAME_KEY) || "Admin"
  );

  const handleLoginSuccess = (username, remember) => {
    setIsAuthenticated(true);
    setAdminName(username);
    if (remember) {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(NAME_KEY, username);
    }
  };

 const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.error("Laravel logout failed:", error);
  } finally {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(NAME_KEY);
   sessionStorage.removeItem(TOKEN_KEY);

    setIsAuthenticated(false);
  }
};

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      {/* Protected admin area — Sidebar + Header + routed page content */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminLayout onLogout={handleLogout} adminName={adminName} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="document-verification" element={<DocumentVerification />} />
        <Route path="records" element={<Records />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="birthday-list" element={<BirthdayList />} />
      </Route>

      {/* Anything unknown falls back to the right place depending on auth */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
