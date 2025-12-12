import './ContactUs.css'
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


  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
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
      const res = await fetch(`${import.meta.env.VITE_Base_URL}/contactus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      console.log(result);
      

      if (!res.ok) {
        toast.error(result.message || t("contact.sent-failed"));
        return;
      }

      toast.success(t("contact.sent-success"));
      reset();
    } catch {
      toast.error(t("contact.sent-failed"));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-16 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Toaster position="top-right" />

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
            subtitle={t("contact.email-desc")}
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
                {...register("email", {
                  required: t("contact.errors.email"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("contact.errors.email-invalid"),
                  },
                })}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
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
