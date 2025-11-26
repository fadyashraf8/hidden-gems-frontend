import React from "react";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation("Terms of Service");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        {/* Title Centered */}
        <h1 className="footer-page-title text-center">{t("title")}</h1>

        <div className="footer-page-content leading-relaxed space-y-4">
          {/* Last updated */}
          <p className="text-gray-600">{t("title-discreption")}</p>

          {/* Acceptance */}
          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("Acceptance-title")}
          </h2>
          <p>{t("Acceptance-paragraph")}</p>

          {/* License */}
          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("License-title")}
          </h2>
          <p>{t("License-paragraph")}</p>

          {/* User Content */}
          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("Content-title")}
          </h2>
          <p>{t("Content-paragraph")}</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
