import React from "react";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation("Blog");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">{t("title")}</h1>
        <div className="footer-page-content">
          <div className="space-y-8">
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-2 text-[#DD0303]">
                {t("Top-title")}
              </h2>
              <p className="mb-4 text-sm">{t("Top-discreption")}</p>
              <p>{t("Top-paragraph")}</p>
            </div>

            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-2 text-[#DD0303]">
                {t("How-Write-title")}
              </h2>
              <p className="mb-4 text-sm">{t("How-Write-discreption")}</p>
              <p>{t("How-Write-paragraph")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
