import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";
import "../Admin/Admin.css"; // Reusing layout styles
import "./Owner.css";

export default function OwnerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      {!isSidebarOpen && (
        <button className="menu-toggle-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
      )}
      <OwnerSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div className={`admin-content ${isSidebarOpen ? "shifted" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}
