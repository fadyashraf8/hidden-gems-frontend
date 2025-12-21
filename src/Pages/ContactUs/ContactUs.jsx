import "./ContactUs.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, Input, Textarea, Button } from "@heroui/react";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "../LoadingScreen";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const InfoItem = ({ icon: Icon, title, subtitle }) => (
  <div className="flex gap-4 mb-6">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
      {Icon && <Icon />}
    </div>
    <div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 whitespace-pre-line">{subtitle}</p>
    </div>
  </div>
);

export default function ContactUsPage() {
  const { t, i18n } = useTranslation("ContactUs");
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useSelector((state) => state.user || {});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (isLoggedIn && userInfo?.email) {
      setValue("email", userInfo.email);
    }
  }, [isLoggedIn, userInfo, setValue]);

  useEffect(() => {
    Object.keys(errors).forEach((field) => {
      const error = errors[field];
      if (error?.type === "required") {
        setError(field, {
          type: "required",
          message: t(`contact.errors.${field}`),
        });
      }
      if (error?.type === "minLength") {
        setError(field, {
          type: "minLength",
          message: t(`contact.errors.${field}-short`),
        });
      }
      if (error?.type === "pattern") {
        setError(field, {
          type: "pattern",
          message: t("contact.errors.email-invalid"),
        });
      }
    });
  }, [i18n.language]);

  const onSubmit = async (data) => {
    try {
      // Ensure email is included if pre-filled
      const submissionData = {
        ...data,
        email: isLoggedIn && userInfo?.email ? userInfo.email : data.email,
      };

      const res = await fetch(`${import.meta.env.VITE_Base_URL}/contactus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();

      // console.log(result);

      if (!res.ok) {
        toast.error(result.message || t("contact.sent-failed"));
        return;
      }

      toast.success(t("contact.sent-success"));
      reset();
      if (isLoggedIn && userInfo?.email) {
        setValue("email", userInfo.email);
      }
    } catch {
      toast.error(t("contact.sent-failed"));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-16 px-4 relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Toaster position="top-right" />

      {/* Blur Overlay for Non-Authenticated Users */}
      {!isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Sign In Required
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please sign in to contact us. We need to verify your identity to
                process your message.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          {t("contact.title")}
        </h1>
        <p className="text-gray-600 text-lg">{t("contact.subtitle")}</p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <InfoItem
            icon={LocationOnIcon}
            title={t("contact.office-title")}
            subtitle={t("contact.office-desc")}
          />
          <InfoItem
            icon={PhoneIcon}
            title={t("contact.phone-title")}
            subtitle={t("contact.phone-desc")}
          />
          <InfoItem
            icon={EmailIcon}
            title={t("contact.email-title")}
            subtitle="support@hiddengemsy.com"
          />
        </div>

        <div className="flex-[2]">
          <Card className="p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {t("contact.form-title")}
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              {t("contact.form-subtitle")}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t("contact.first-name")}
                  {...register("firstName", {
                    required: t("contact.errors.firstName"),
                    minLength: {
                      value: 2,
                      message: t("contact.errors.firstName-short"),
                    },
                  })}
                  isInvalid={!!errors.firstName}
                  errorMessage={errors.firstName?.message}
                />

                <Input
                  label={t("contact.last-name")}
                  {...register("lastName", {
                    required: t("contact.errors.lastName"),
                    minLength: {
                      value: 2,
                      message: t("contact.errors.lastName-short"),
                    },
                  })}
                  isInvalid={!!errors.lastName}
                  errorMessage={errors.lastName?.message}
                />
              </div>

              <Input
                label={t("contact.email")}
                type="email"
                {...(isLoggedIn && userInfo?.email
                  ? { value: userInfo.email }
                  : register("email", {
                      required: t("contact.errors.email"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("contact.errors.email-invalid"),
                      },
                    }))}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                isReadOnly={isLoggedIn && !!userInfo?.email}
                className={
                  isLoggedIn && userInfo?.email
                    ? "bg-gray-100 dark:bg-zinc-700/30 rounded-xl"
                    : ""
                }
                description={
                  isLoggedIn && userInfo?.email
                    ? "Email is pre-filled from your account"
                    : ""
                }
              />

              <Textarea
                label={t("contact.message")}
                minRows={5}
                {...register("message", {
                  required: t("contact.errors.message"),
                  minLength: {
                    value: 10,
                    message: t("contact.errors.message-short"),
                  },
                })}
                isInvalid={!!errors.message}
                errorMessage={errors.message?.message}
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold py-3"
                endContent={<SendIcon />}
              >
                {isSubmitting ? t("contact.sending") : t("contact.send-btn")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
