import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarOwner from "../SidebarOwner/SidebarOwner";
import ScrollToTop from "../../../Components/ScrollToTop";
import { useTranslation } from "react-i18next";

export default function LayoutOwner() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop />
      <SidebarOwner isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
         <main
        className={`min-h-screen transition-all duration-300 ${
          i18n.language === "ar"
            ? isCollapsed
              ? "lg:mr-0"
              : "lg:mr-64"
            : isCollapsed
            ? "lg:ml-0"
            : "lg:ml-64"
        }`}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
