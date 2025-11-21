import React from "react";
import { NavLink } from "react-router-dom";
import "./Admin.css";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <button className="close-sidebar-btn" onClick={toggleSidebar}>
          &times;
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/admin/users"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={() => window.innerWidth < 768 && toggleSidebar()}
        >
          Users
        </NavLink>
           <NavLink
          to="/admin/categories"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={() => window.innerWidth < 768 && toggleSidebar()}
        >
          Categories
        </NavLink>
        <NavLink
          to="/admin/gems"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={() => window.innerWidth < 768 && toggleSidebar()}
        >
          Gems
        </NavLink>
     
      </nav>
    </div>
  );
}
