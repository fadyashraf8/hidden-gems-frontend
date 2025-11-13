import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const aboutLinks = [
    {
      name: "About Us",
      to: "/about/aboutUS",
    },
    { name: "Careers", to: "/about/careers" },
    { name: "Content Guidelines", to: "/about/content" },
    { name: "Terms of Service", to: "/about/terms" },
    { name: "Privacy Policy", to: "/about/privacy" },
  ];

  const discoverLinks = [
    { name: "Blog", to: "/discover/blog" },
    { name: "Support", to: "/discover/support" },
    {
      name: "Explore Cities",
      to: "/discover/cities",
    },
    { name: "Hidden", to: "/discover/Hidden" },
  ];

  const businessLinks = [
    { name: "For Businesses", to: "/business/business" },
    { name: "Add Your Place", to: "/business/addPlace" },
    { name: "Advertising", to: "/business/advertising" },
    { name: "Partner With Us", to: "/business/partners" },
  ];

  const linkStyle =
    "block py-2 px-3 rounded transition-all duration-200 hover:bg-gray-100 hover:border-l-4 hover:border-[#DD0303] hover:text-[#DD0303] hover:font-medium hover:pl-4";

  return (
    <footer className="bg-gray-50 border-t mt-10 text-gray-700 text-sm flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-6xl px-10 py-20 grid grid-cols-2 md:grid-cols-3 gap-12 justify-items-center">
        {/* About */}
        <div>
          <h3 className="text-[#DD0303] font-semibold mb-5 text-base uppercase tracking-wide">
            About
          </h3>
          <ul className="space-y-1">
            {aboutLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.to} className={linkStyle}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Discover */}
        <div>
          <h3 className="text-[#DD0303] font-semibold mb-5 text-base uppercase tracking-wide">
            Discover
          </h3>
          <ul className="space-y-1">
            {discoverLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.to} className={linkStyle}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* For Businesses */}
        <div>
          <h3 className="text-[#DD0303] font-semibold mb-5 text-base uppercase tracking-wide">
            For Businesses
          </h3>
          <ul className="space-y-1">
            {businessLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.to} className={linkStyle}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
