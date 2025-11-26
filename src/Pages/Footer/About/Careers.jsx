import React from "react";
import { useTranslation } from "react-i18next";

const Careers = () => {
  const { t } = useTranslation("Careers");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        {/* Title Centered */}
        <h1 className="footer-page-title text-center">{t("title")}</h1>

        <div className="footer-page-content leading-relaxed space-y-4">
          <p>{t("Careers-p-1")}</p>
          <p>{t("Careers-p-2")}</p>
          <p>{t("Careers-p-3")}</p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
