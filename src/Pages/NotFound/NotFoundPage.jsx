import { Button, Divider } from "@heroui/react";
import Shuffle from "../../Components/Shuffle/Shuffle";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation("notfound");
  const isArabic = i18n.language === "ar";

  return (
    <div
      className={`page-wrapper height-full text-center ${isArabic ? "rtl" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Shuffle Error 404 */}
      <Shuffle
        text={t("error_404")}
        shuffleDirection="right"
        duration={0.9}
        animationMode="all"
        shuffleTimes={1}
        ease="power3.out"
        stagger={0.05}
        tag="h1"
        className="text-7xl font-extrabold text-red-600 "
        triggerOnHover={true}
        isRTL={isArabic}
      />

      {/* Shuffle Page Not Found */}
      <Shuffle
        text={t("page_not_found")}
        shuffleDirection="right"
        duration={0.9}
        animationMode="all"
        shuffleTimes={2}
        ease="power3.out"
        stagger={0.03}
        tag="h2"
        className="text-5xl font-semibold mb-4 height-20"
        isRTL={isArabic}
      />

      {/* Description */}
      <p className="text-gray-600 mt-2 max-w-md mx-auto">{t("description")}</p>

      <Divider className="w-1/2 my-8" />

      {/* Go Home Button */}
      <Button
        size="lg"
        className="rounded-xl px-10 text-white"
        style={{ backgroundColor: "#DD0303" }}
        onPress={() => (window.location.href = "/")}
      >
        {t("go_home")}
      </Button>
    </div>
  );
}
