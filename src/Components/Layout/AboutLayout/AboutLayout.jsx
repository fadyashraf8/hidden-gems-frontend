import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScrollToTop from "../../ScrollToTop";

const AboutLayout = () => {
  const { t } = useTranslation("AboutLayout");

  const menuItems = [
    { to: "aboutUS", label: t("about-us") },
    { to: "careers", label: t("careers") },
    { to: "terms", label: t("terms") },
    { to: "privacy", label: t("privacy-policy") },
    { to: "content", label: t("content-guidelines") },
  ];

  return (
    <div className="mt-10 flex flex-col md:flex-row max-w-6xl mx-auto py-12 px-6 gap-10">
      <ScrollToTop />
      {/* Sidebar */}
      <aside className="md:w-1/4 border-r border-gray-200 pr-4">
        <h2 className="text-xl font-semibold mb-4 text-[#DD0303]">
          {t("about-hidden-gems")}
        </h2>

        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-[#dd030315] font-medium text-[#DD0303] border-l-4 border-[#DD0303]"
                      : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-400"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content Area */}
      <main className="md:w-3/4">
        <Outlet />
      </main>
    </div>
  );
};

export default AboutLayout;
