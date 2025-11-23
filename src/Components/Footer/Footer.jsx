import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const aboutLinks = [
    {
      name: "link_about_us",
      to: "/about/aboutUS",
    },
    { name: "link_careers", to: "/about/careers" },
    { name: "link_content_guidelines", to: "/about/content" },
    { name: "link_terms_of_service", to: "/about/terms" },
    { name: "link_privacy_policy", to: "/about/privacy" },
  ];

  const discoverLinks = [
    { name: "link_blog", to: "/discover/blog" },
    { name: "link_support", to: "/discover/support" },
    {
      name: "link_explore_cities",
      to: "/discover/cities",
    },
    { name: "link_hidden", to: "/discover/Hidden" },
  ];

  const businessLinks = [
    { name: "link_for_businesses", to: "/business/business" },
    { name: "link_add_your_place", to: "/business/addPlace" },
    { name: "link_advertising", to: "/business/advertising" },
    { name: "link_partner_with_us", to: "/business/partners" },
  ];

  const linkStyle =
    "block py-2 px-3 rounded transition-all duration-200 hover:bg-gray-100 hover:border-l-4 hover:border-[#DD0303] hover:text-[#DD0303] linkStyle";

  return (
    <footer className="bg-gray-50 border-t mt-10 text-gray-700 text-sm flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-6xl px-10 py-20 grid grid-cols-2 md:grid-cols-3 gap-12 justify-items-center">
        {/* About */}
        <div>
          <h3 className="text-[#DD0303] font-semibold mb-5 text-base uppercase tracking-wide">
            {t("footer_about_title")}
          </h3>
          <ul className="space-y-1">
            {aboutLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.to} className={linkStyle}>
                  <span>{t(link.name)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Discover */}
        <div>
          <h3 className="text-[#DD0303] font-semibold mb-5 text-base uppercase tracking-wide">
            {t("footer_discover_title")}
          </h3>
          <ul className="space-y-1">
            {discoverLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.to} className={linkStyle}>
                  <span>{t(link.name)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* For Businesses */}
        <div>
          <h3 className="text-[#DD0303] font-semibold mb-5 text-base uppercase tracking-wide">
            {t("footer_business_title")}
          </h3>
          <ul className="space-y-1">
            {businessLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.to} className={linkStyle}>
                  <span>{t(link.name)}</span>
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
