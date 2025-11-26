import React from "react";
import { useTranslation } from "react-i18next";

const Advertising = () => {
  const { t } = useTranslation("Advertising");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">{t("title")}</h1>
        <div className="footer-page-content">
          <p>{t("title-discreption")}</p>

          <h2 className="text-2xl font-semibold mt-4 text-[#DD0303]">
            {t("Solutions-title")}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("Solutions-p1")}</li>
            <li>{t("Solutions-p2")}</li>
            <li>{t("Solutions-p3")}</li>
            <li>{t("Solutions-p4")}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4 text-[#DD0303]">
            {t("Get-Started-title")}
          </h2>
          <p>{t("Get-Started-p1")}</p>
          <p>{t("Get-Started-p2")}</p>
        </div>
      </div>
    </div>
  );
};

export default Advertising;
