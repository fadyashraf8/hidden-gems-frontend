import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarOwner from "../SidebarOwner/SidebarOwner";

export default function LayoutOwner() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarOwner isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:ml-0" : "lg:ml-64"
        }`}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}