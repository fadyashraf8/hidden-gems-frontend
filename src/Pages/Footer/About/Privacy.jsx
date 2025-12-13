import React from "react";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation("Privacy Policy");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        {/* Title Centered */}
        <h1 className="footer-page-title text-center">{t("title")}</h1>

        <div className="footer-page-content leading-relaxed space-y-4">
          {/* Last Updated */}
          <p className="text-gray-600 text-sm">{t("title-discreption")}</p>

          {/* Information We Collect */}
          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("Information-title")}
          </h2>
          <p>{t("Information-paragraph")}</p>

          {/* How We Use This Information */}
          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("How-use-title")}
          </h2>
          <p>{t("How-use-paragraph")}</p>

          {/* Sharing */}
          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("Sharing-title")}
          </h2>
          <p>{t("Sharing-paragraph")}</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
