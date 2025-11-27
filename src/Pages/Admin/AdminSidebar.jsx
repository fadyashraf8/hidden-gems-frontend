import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import "./Admin.css";

import { useTranslation } from "react-i18next";
import TranslateTwoToneIcon from "@mui/icons-material/TranslateTwoTone";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.darkMode.enabled);

  const { t, i18n } = useTranslation("Admin");

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      toast.success(t("signed-out-successfully"), {
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
    <div
      className={`admin-sidebar ${isOpen ? "open" : ""} ${
        i18n.language === "ar" ? "rtl" : ""
      }`}
    >
      <div className="sidebar-header">
        <h2>{t("admin-panel")}</h2>
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
            {t("users")}
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            {t("categories")}
          </NavLink>

          <NavLink
            to="/admin/gems"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            {t("all-gems")}
          </NavLink>

          <NavLink
            to="/admin/my-gems"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            {t("my-gems")}
          </NavLink>
        </div>

        {/* Language Toggle */}
        <div
          className="sidebar-btn language-toggle"
          onClick={() => {
            const newLang = i18n.language === "en" ? "ar" : "en";
            i18n.changeLanguage(newLang);
          }}
        >
          <TranslateTwoToneIcon
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          {i18n.language === "en" ? t("arabic") : t("english")}
        </div>

        <div className="nav-group bottom-actions">
          <button
            className="sidebar-btn dark-mode-toggle"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {isDarkMode ? t("light-mode") : t("dark-mode")}
          </button>

          <NavLink
            to="/"
            className="return-home-link"
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            {t("return-home")}
          </NavLink>

          <button className="signout-btn" onClick={handleLogout}>
            {t("sign-out")}
          </button>
        </div>
      </nav>
    </div>
  );
}
