import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  FolderOpen,
  Gem,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/userSlice";
import toast from "react-hot-toast";
import { toggleDarkMode } from "../../../redux/darkModeSlice";
import { useTranslation } from "react-i18next";
import TranslateTwoToneIcon from "@mui/icons-material/TranslateTwoTone";

export default function SidebarAdmin({ isCollapsed, setIsCollapsed }) {
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
        icon: "👋",
      });
      navigate("/");
    });
  };

  const [openSections, setOpenSections] = useState({
    users: false,
    categories: false,
    gems: false,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const menuItems = [
    {
      id: "users",
      title: ` ${t("Users")}`,
      icon: Users,
      items: [
        { label: `👤 ${t("All Users")}`, path: "/admin/users" },
        { label: `➕ ${t("Add User")}`, path: "/admin/users/add" },
      ],
    },
    {
      id: "categories",
      title: ` ${t("Categories")}`,
      icon: FolderOpen,
      items: [
        { label: `📋 ${t("All Categories")}`, path: "/admin/categories" },
        { label: `➕ ${t("Add Category")}`, path: "/admin/categories/add" },
      ],
    },
    {
      id: "gems",
      title: ` ${t("Gems")}`,
      icon: Gem,
      items: [
        { label: `💠 ${t("All Hidden Gems")}`, path: "/admin/gems" },
        { label: `✨ ${t("Add Hidden Gem")}`, path: "/admin/gems/add" },
        { label: `⭐ ${t("My Hidden Gems")}`, path: "/admin/gems/user" },
      ],
    },
  ];

  const sidebarSide = i18n.language === "ar" ? "right-0" : "left-0";
  const toggleButtonSide =
    i18n.language === "ar"
      ? isCollapsed
        ? "right-4"
        : "right-60"
      : isCollapsed
      ? "left-4"
      : "left-60";
  const mobileTranslate = isMobileOpen
    ? "translate-x-0"
    : i18n.language === "ar"
    ? "translate-x-full lg:translate-x-0"
    : "-translate-x-full lg:translate-x-0";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed top-4   ${
          i18n.language === "ar" ? "right-4 " : "left-4"
        } z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg`}
      >
        {isMobileOpen ? <X size={24}   /> : <Menu size={24} />}
      </button>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden lg:block fixed top-4 ml-4  
          
           ${i18n.language === "ar" ? "mr-4 " : "left-4"}
          z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg transition-all duration-300 ${toggleButtonSide}`}
      >
        {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0  ${sidebarSide} h-screen bg-slate-800 text-white z-40
          transition-all duration-300 ease-in-out overflow-hidden
          ${isCollapsed ? "lg:w-0 lg:opacity-0" : "lg:w-64 lg:opacity-100"}
          w-64 ${mobileTranslate}`}
      >
        <div className="p-6 border-b border-slate-700">
          <Link
            to="/admin"
            className="inline-block px-6 py-3 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
          >
            🛠️ {t("Admin Panel")}
          </Link>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-88px)]">
          {menuItems.map((section) => (
            <div key={section.id} className="mb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 cursor-pointer rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <section.icon size={20} />
                  <span className="font-medium ">{section.title}</span>
                </div>
                {openSections[section.id] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>

              {openSections[section.id] && (
                <div className="mt-1  ml-4 space-y-1">
                  {section.items.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="block p-2 pl-8 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

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
              {isDarkMode ? `☀️ ${t("Light Mode")}` : `🌙 ${t("Dark Mode")}`}
            </button>

            <Link to="/" className="sidebar-btn dark-mode-toggle">
              🏠 {t("Return to Home")}
            </Link>

            <button
              className="sidebar-btn dark-mode-toggle "
              onClick={handleLogout}
            >
              🚪 {t("Sign Out")}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
