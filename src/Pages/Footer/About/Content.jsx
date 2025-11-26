import React from "react";
import { useTranslation } from "react-i18next";

const Content = () => {
  const { t } = useTranslation("Guidelines");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        {/* Title */}
        <h1 className="footer-page-title text-center">{t("title")}</h1>

        <div className="footer-page-content">
          <div className="mb-16">
            {/* General Guidelines */}
            <h2 className="text-2xl font-bold text-[#DD0303] mb-2">
              {t("General-title")}
            </h2>
            <p className="leading-relaxed mb-6">{t("General -p")}</p>

            {/* Relevance */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#DD0303] mb-2">
                {t("Relevance-title")}
              </h3>
              <p className="leading-relaxed">{t("Relevance-p")}</p>
            </div>

            {/* Inappropriate Content */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#DD0303] mb-2">
                {t("Inappropriate-title")}
              </h3>
              <p className="leading-relaxed">{t("Inappropriate-p")}</p>
            </div>

            {/* Conflicts of Interest */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#DD0303] mb-2">
                {t("Conflicts-title")}
              </h3>
              <p className="leading-relaxed">{t("Conflicts-p")}</p>
            </div>

            {/* Privacy */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#DD0303] mb-2">
                {t("Privacy-title")}
              </h3>
              <p className="leading-relaxed">{t("Privacy-p")}</p>
            </div>

            {/* Promotional Content */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#DD0303] mb-2">
                {t("Promotional-title")}
              </h3>
              <p className="leading-relaxed">{t("Promotional-p")}</p>
            </div>

            {/* Post Your Own Content */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-[#DD0303] mb-2">
                {t("Own-title")}
              </h3>
              <p className="leading-relaxed">{t("Own-p")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
