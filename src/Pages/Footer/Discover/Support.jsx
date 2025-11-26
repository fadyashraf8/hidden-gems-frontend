import React from "react";
import { useTranslation } from "react-i18next";

const Support = () => {
  const { t } = useTranslation("Support");

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">{t("title")}</h1>

        <div className="footer-page-content text-lg">
          {/* Description */}
          <p>{t("title-discreption")}</p>

          {/* Contact Section */}
          <h2 className="text-2xl font-semibold mt-8 text-[#DD0303]">
            {t("Contact-title")}
          </h2>

          <p>
            <strong>Email:</strong>{" "}
            {t("Contact-discreption").replace("البريد الالكتروني: ", "")}
          </p>

       

          <p>
            <strong>Phone:</strong>{" "}
            {t("Contact-phone").replace("رقم الهاتف: ", "")}
          </p>

          {/* FAQs */}
          <h2 className="text-2xl font-semibold mt-8 text-[#DD0303]">
            {t("FAQs-title")}
          </h2>

          <p>
            <strong className="text-[#DD0303]">{t("f1-discreption")}</strong>
          </p>
          <p>{t("f1-paragraph")}</p>

          <p className="mt-4">
            <strong className="text-[#DD0303]">{t("f2-discreption")}</strong>
          </p>
          <p>{t("f2-paragraph")}</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
