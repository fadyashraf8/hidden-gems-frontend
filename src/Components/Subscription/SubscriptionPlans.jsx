import React, { useState } from "react";
import { Check, Crown, Star, Briefcase } from "lucide-react";
import {
  checkoutGold,
  checkoutPlatinum,
  checkoutOwner,
  checkoutChange,
} from "../../Services/SubscriptionService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./SubscriptionPlan.css"

const SubscriptionPlans = ({ compact = false }) => {
  const { t } = useTranslation("subscription");
  const { userInfo } = useSelector((state) => state.user || {});
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      if (plan === "gold") await checkoutGold();
      else if (plan === "platinum") await checkoutPlatinum();
      else if (plan === "owner") await checkoutOwner();
      else if (plan === "manage") await checkoutChange();
    } catch (error) {
      toast.error(error.message || t("errors.checkoutFailed"));
      setLoading(false);
    }
  };

  const currentPlan = userInfo?.subscription || "free";
  const isOwner = userInfo?.role === "owner";

  // ---------------- Compact Card ----------------
  if (compact) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-400" />
          <div>
            <h3 className="font-bold text-lg">{t("compact.title")}</h3>
            <p className="text-sm text-gray-300">{t("compact.subtitle")}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Gold */}
          <button
            onClick={() => handleSubscribe("gold")}
            disabled={loading || currentPlan === "gold"}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {currentPlan === "gold"
              ? t("compact.currentGold")
              : t("compact.getGold")}
          </button>

          {/* Platinum */}
          <button
            onClick={() => handleSubscribe("platinum")}
            disabled={loading || currentPlan === "platinum"}
            className="w-full bg-gradient-to-r from-slate-300 to-slate-100 text-black font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {currentPlan === "platinum"
              ? t("compact.currentPlatinum")
              : t("compact.getPlatinum")}
          </button>

          {!isOwner && (
            <button
              onClick={() => handleSubscribe("owner")}
              disabled={loading}
              className="w-full bg-transparent border border-white/20 text-white font-semibold py-2.5 rounded-xl hover:bg-white/10 transition"
            >
              {t("compact.becomeOwner")}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------- Full Plans Grid ----------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ------ GOLD ------ */}
      <div
        className={`relative bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border-2 ${
          currentPlan === "gold" ? "border-yellow-400" : "border-transparent"
        } hover:border-yellow-400 transition-all duration-300`}
      >
        {currentPlan === "gold" && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
            {t("common.currentPlan")}
          </div>
        )}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-2 goldd">
          {t("gold.title")}
        </h3>
        <p className="text-center text-gray-500 text-sm mb-6 dark:text-gray-400">
          {t("gold.subtitle")}
        </p>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="w-4 h-4 text-green-500" />
            <span>{t("gold.feature1")}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="w-4 h-4 text-green-500" />
            <span>{t("gold.feature2")}</span>
          </li>
        </ul>

        <button
          onClick={() => handleSubscribe("gold")}
          disabled={loading || currentPlan === "gold"}
          className={`w-full py-3 cursor-pointer  rounded-xl font-bold transition ${
            currentPlan === "gold"
              ? "bg-gray-100 text-gray-400 cursor-default"
              : "bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg shadow-yellow-400/20"
          }`}
        >
          {loading
            ? t("common.processing")
            : currentPlan === "gold"
            ? t("common.active")
            : t("gold.choose")}
        </button>
      </div>

      {/* ------ PLATINUM ------ */}
      <div
        className={`relative bg-gray-900 text-white rounded-2xl p-6 shadow-xl border-2 ${
          currentPlan === "platinum" ? "border-slate-400" : "border-transparent"
        } transform md:-translate-y-4`}
      >
        {currentPlan === "platinum" && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-400 text-black text-xs font-bold px-3 py-1 rounded-full">
            {t("common.currentPlan")}
          </div>
        )}

        <div className="absolute top-0 right-0 p-4">
          <Crown className="w-6 h-6 text-slate-300" />
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-2">
          {t("platinum.title")}
        </h3>
        <p className="text-center text-gray-400 text-sm mb-6">
          {t("platinum.subtitle")}
        </p>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="w-4 h-4 text-green-400" />
            <span>{t("platinum.feature1")}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="w-4 h-4 text-green-400" />
            <span>{t("platinum.feature2")}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="w-4 h-4 text-green-400" />
            <span>{t("platinum.feature3")}</span>
          </li>
        </ul>

        <button
          onClick={() => handleSubscribe("platinum")}
          disabled={loading || currentPlan === "platinum"}
          className={`w-full py-3 rounded-xl cursor-pointer font-bold transition ${
            currentPlan === "platinum"
              ? "bg-white/10 text-gray-400 cursor-default"
              : "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10"
          }`}
        >
          {loading
            ? t("common.processing")
            : currentPlan === "platinum"
            ? t("common.active")
            : t("platinum.choose")}
        </button>
      </div>

      {/* ------ OWNER ------ */}
      <div
        className={`relative bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border-2 ${
          isOwner ? "border-[#DD0303]" : "border-transparent"
        } hover:border-[#DD0303] transition-all duration-300`}
      >
        {isOwner && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#DD0303] text-white text-xs font-bold px-3 py-1 rounded-full">
            {t("common.currentRole")}
          </div>
        )}

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-[#DD0303]" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-2 owner ">
          {t("owner.title")}
        </h3>
        <p className="text-center text-gray-500 text-sm mb-6 dark:text-gray-400">
          {t("owner.subtitle")}
        </p>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="w-4 h-4 text-green-500" />
            <span>{t("owner.feature1")}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="w-4 h-4 text-green-500" />
            <span>{t("owner.feature2")}</span>
          </li>
        </ul>

        <button
          onClick={() => handleSubscribe("owner")}
          disabled={loading || isOwner}
          className={`w-full py-3 cursor-pointer  rounded-xl font-bold transition ${
            isOwner
              ? "bg-gray-100 text-gray-400 cursor-default"
              : "bg-[#DD0303] text-white hover:bg-[#b90202] shadow-lg shadow-[#dd0303]/20"
          }`}
        >
          {loading
            ? t("common.processing")
            : isOwner
            ? t("common.active")
            : t("owner.choose")}
        </button>
      </div>

      {(currentPlan !== "free" || isOwner) && (
        <div className="col-span-full flex justify-center mt-4">
          <button
            onClick={() => handleSubscribe("manage")}
            className="text-gray-500 hover:text-gray-700 underline text-sm"
          >
            {t("common.manageBilling")}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
