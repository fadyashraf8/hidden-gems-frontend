import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import "./Admin.css";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.darkMode.enabled);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      toast.success("Signed out successfully", {
        style: {
          background: "#DD0303",
          color: "white",
        },
        iconTheme: {
          primary: "white",
          secondary: "#DD0303",
        },
      });
      navigate("/");
    });
  };

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <button className="close-sidebar-btn" onClick={toggleSidebar}>
          &times;
        </button>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-group">
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
            All Gems
          </NavLink>
          <NavLink
            to="/admin/my-gems"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            My Gems
          </NavLink>
        </div>

        <div className="nav-group bottom-actions">
          <button
            className="sidebar-btn dark-mode-toggle"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {isDarkMode ? "☀️ Light Mode" : "⏾ Dark Mode"}
          </button>
          <NavLink
            to="/"
            className="return-home-link"
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            Return to Home
          </NavLink>
          <button className="signout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  );
}
