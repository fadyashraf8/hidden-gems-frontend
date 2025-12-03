import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyEmailAPI } from "../../Services/RegisterAuth";
import { Mail, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const { t, i18n } = useTranslation("verifyEmail");
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(location.state?.email || "");
  const isArabic = i18n.language === "ar";

  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
  ];
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setBgIndex((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const particlesInit = async (main) => await loadFull(main);

  const particlesOptions = {
    fullScreen: { enable: false },
    particles: {
      number: { value: 40 },
      size: { value: 3 },
      move: { enable: true, speed: 1.5, outModes: "bounce" },
      color: { value: "#DD0303" },
      links: {
        enable: true,
        distance: 120,
        color: "#DD0303",
        opacity: 0.2,
        width: 1,
      },
    },
    detectRetina: true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { code: "" },
  });

  const onSubmit = async ({ code }) => {
    setIsLoading(true);
    const res = await verifyEmailAPI({ email, code });
    setIsLoading(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message || t("success-message"));
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div
      className={`page-wrapper relative min-h-screen flex items-center justify-center overflow-hidden ${
        isArabic ? "rtl" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Background Slideshow */}
      <AnimatePresence>
        <motion.div
          key={bgIndex}
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${images[bgIndex]})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Form */}
      <motion.div
        className="auth-card relative z-10 mt-13 max-w-md mx-auto rounded-xl p-6 bg-[#111111]/85 backdrop-blur-sm shadow-lg transition-transform duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 25px rgba(255, 0, 0, 0.3)",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Back to Home */}
        <div className="mb-4 flex items-center gap-2 cursor-pointer">
          <span className="text-[#DD0303] font-medium">
            <Link to="/">
              <span className="text-[#DD0303] text-lg">{t("arrow")}</span>

              {t("Home")}
            </Link>
          </span>
        </div>

        {/* Icon + Animation */}
        <motion.div
          className="w-full flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-18 rounded-full flex items-center justify-center bg-[#DD0303]/10">
            <img
              src="/images/Gem.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="auth-title text-center text-2xl font-bold text-white">
            {t("verify-title")}
          </h1>
          <p className="text-center text-gray-400 mb-4">
            {t("verify-subtitle")}
          </p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <label className="text-[#DD0303] font-medium">
            {t("email-label")}
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              type="email"
              isRequired
              classNames={{
                inputWrapper: `pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)] ${
                  isArabic ? "text-right" : ""
                }`,
              }}
            />
          </div>

          {/* Verification Code */}
          <label className="text-[#DD0303] font-medium">
            {t("code-label")}
          </label>
          <div className="relative">
            <Key size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              variant="bordered"
              isInvalid={!!errors.code}
              errorMessage={errors.code?.message}
              placeholder={t("code-placeholder")}
              {...register("code", { required: t("code-required") })}
              classNames={{
                inputWrapper: `pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)] ${
                  isArabic ? "text-right" : ""
                }`,
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full bg-[#DD0303] text-white py-3 rounded-lg hover:bg-[#bb0303]"
          >
            {t("verify-button")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
