import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import "../Admin/Admin.css"; // Reusing Admin sidebar styles
import "./Owner.css";

export default function OwnerSidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.darkMode.enabled);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      dispatch(logoutUser()).then(() => {
        navigate("/");
      });
    }
  };

  const handleDeleteRestaurant = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your restaurant? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("ownerRestaurants");
      // Force a reload or navigate to refresh the dashboard state
      window.location.reload();
    }
  };

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Owner Panel</h2>
        <button className="close-sidebar-btn" onClick={toggleSidebar}>
          &times;
        </button>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-group">
          <NavLink
            to="/owner/dashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            My Restaurant
          </NavLink>
          <button
            className="sidebar-btn"
            style={{
              color: "#dc3545",
              marginTop: "10px",
              textAlign: "left",
              paddingLeft: "15px",
            }}
            onClick={handleDeleteRestaurant}
          >
            Delete Restaurant
          </button>
        </div>

        <div className="nav-group bottom-actions">
          <button
            className="sidebar-btn dark-mode-toggle"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
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
