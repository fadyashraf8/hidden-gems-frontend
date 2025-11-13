import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const DiscoverLayout = () => {
  const menuItems = [
    { to: "blog", label: "Blog" },
    { to: "support", label: "Support" },
    { to: "cities", label: "Cities" },
    { to: "hidden", label: "Hidden" },
  ];

  return (
    <div className="mt-10 flex flex-col md:flex-row max-w-6xl mx-auto py-12 px-6 gap-10">
      {/* Sidebar */}
      <aside className="md:w-1/4 border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Discover Hidden Gems</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded transition-all duration-200 ${
                    isActive
                      ? "bg-gray-200 font-medium text-[#DD0303] border-l-4 border-[#DD0303]"
                      : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300 hover:font-medium"
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
        <Outlet /> {/* هنا بيتعرض المحتوى الخاص باللينك */}
      </main>
    </div>
  );
};

export default DiscoverLayout;
