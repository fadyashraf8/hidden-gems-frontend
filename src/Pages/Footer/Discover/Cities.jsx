import React from "react";
import { useTranslation } from "react-i18next";

const Cities = () => {
  const { t } = useTranslation("Cities");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">{t("title")}</h1>
        <div className="footer-page-content">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {t("cities", { returnObjects: true }).map((city) => (
              <a
                key={city}
                href={`/cities/${city.toLowerCase().replace(" ", "-")}`}
                className="p-4 border rounded-lg hover:bg-[#DD0303] hover:text-amber-50 text-center"
              >
                {city}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
