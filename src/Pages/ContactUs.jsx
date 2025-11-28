import React, { useState } from "react";
import { Card, Input, Textarea, Button } from "@heroui/react";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";

const InfoItem = ({ icon: Icon, title, subtitle }) => (
  <div className="flex gap-4 mb-6">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 ">
      {React.createElement(Icon)}
    </div>
    <div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 whitespace-pre-line">{subtitle}</p>
    </div>
  </div>
);

export default function ContactUsPage() {
  const { t } = useTranslation("ContactUs");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
    };

    emailjs
      .send(
        "service_8idncm9",
        "template_nbmj3ig",
        templateParams,
        "OZzaqu7xm09m4RX1J"
      )
      .then(
        () => {
          alert(t("contact.sent-success"));
          setFormData({ firstName: "", lastName: "", email: "", message: "" });
          setLoading(false);
        },
        () => {
          alert(t("contact.sent-failed"));
          setLoading(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-17 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          {t("contact.title")}
        </h1>
        <p className="text-gray-600 text-lg">
          {t("contact.subtitle")}
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Column */}
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

        {/* Right Column */}
        <div className="flex-2">
          <Card className="p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {t("contact.form-title")}
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              {t("contact.form-subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t("contact.first-name")}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label={t("contact.last-name")}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label={t("contact.email")}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Textarea
                label={t("contact.message")}
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center space-x-2 py-3 text-white font-bold"
              >
                <span>{loading ? t("contact.sending") : t("contact.send-btn")}</span>
                <SendIcon />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
