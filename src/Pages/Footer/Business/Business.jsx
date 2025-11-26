import React from "react";
import { useTranslation } from "react-i18next";

const Business = () => {
  const { t } = useTranslation("Business");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">{t("title")}</h1>
        <div className="footer-page-content">
          <p>{t("title-discreption")}</p>

          <h2 className="text-2xl font-semibold mt-3 text-[#DD0303]">
            {t("Benefits-title")}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("Benefits-p1")}</li>
            <li>{t("Benefits-p2")}</li>
            <li>{t("Benefits-p3")}</li>
            <li>{t("Benefits-p4")}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("Get-Started-title")}
          </h2>
          <p>{t("Get-Started-p1")}</p>
        </div>
      </div>
    </div>
  );
};

export default Business;
