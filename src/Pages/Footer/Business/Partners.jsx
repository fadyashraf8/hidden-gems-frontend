import React from "react";
import { useTranslation } from "react-i18next";

const Partners = () => {
  const { t } = useTranslation("Partners");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">{t("title")}</h1>
        <div className="footer-page-content">
          <p>{t("title-discreption")}</p>

          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("Partners-title")}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("Partners-p1")}</li>
            <li>{t("Partners-p2")}</li>
            <li>{t("Partners-p3")}</li>
            <li>{t("Partners-p4")}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            {t("Contact-title")}
          </h2>
          <p>{t("Contact-p1")}</p>
        </div>
      </div>
    </div>
  );
};

export default Partners;
