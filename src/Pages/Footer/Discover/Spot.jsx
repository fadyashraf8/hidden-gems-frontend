import React from "react";
import { useTranslation } from "react-i18next";

const Spot = () => {
  const { t } = useTranslation("Spot");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">{t("title")}</h1>
        <div className="footer-page-content">
          <div className="space-y-6 text-lg">
            <p>{t("title-p1")}</p>
            <p>{t("title-p2")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spot;
