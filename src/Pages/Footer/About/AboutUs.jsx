import React from "react";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation("About"); // ملف الترجمة اسمه about.json

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        {/* TITLE */}
        <h1 className="footer-page-title text-center">{t("title")}</h1>

        <div className="footer-page-content">
          {/* DESCRIPTION */}
          <p className="leading-relaxed">{t("title-discreption")}</p>

          {/* Mission */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303]">
              {t("Mission-title")}
            </h3>
            <p className="leading-relaxed">{t("Mission-paragraph")}</p>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
              {t("Community-title")}
            </h3>
            <p className="leading-relaxed">{t("Community-paragraph")}</p>
          </div>

          {/* Why gemsy */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
              {t("Whygemsy-title")}
            </h3>

            <ul className="leading-relaxed">
              <li>{t("whygemsy-p-1")}</li>
              <li>{t("whygemsy-p-2")}</li>
              <li>{t("whygemsy-p-3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
