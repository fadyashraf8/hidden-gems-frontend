import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/reset";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Key } from "lucide-react";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("reset");
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

  const particlesInit = async (main) => {
    await loadFull(main);
  };

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
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", code: "", newPassword: "" },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_Base_URL}/auth/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      setIsLoading(false);

      if (!res.ok) {
        toast.error(t("errors.invalidCodeOrEmail"));
      } else {
        toast.success(t("success.passwordChanged"));
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(t("errors.general") || err?.message);
    }
  };

  return (
    <div className="page-wrapper relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
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

      {/* Form Card */}
      <motion.div
        className="auth-card relative z-10 max-w-md mx-auto rounded-xl p-6 bg-[#111111]/85 backdrop-blur-sm shadow-lg transition-transform duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 25px rgba(255, 0, 0, 0.3)",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-4 flex items-center gap-2 cursor-pointer">
          <span className="text-[#DD0303] font-medium">
            <Link to="/">
              <span className="text-[#DD0303] text-lg">{t("arrow")}</span>

              {t("Home")}
            </Link>
          </span>
        </div>
        {/* Logo */}
        <div className="w-full flex justify-center mb-4">
          <div className="w-20 h-18 rounded-full flex items-center justify-center bg-[#DD0303]/10">
            <img
              src="/images/Gem.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="auth-title text-center text-2xl font-bold text-white mb-6">
          {t("auth.resetPasswordTitle")}
        </h1>

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          style={{ direction: isArabic ? "rtl" : "ltr" }}
        >
          <label className="text-[#DD0303] font-medium">
            {t("auth.email")}
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={!!errors.email}
              errorMessage={errors.email ? t(errors.email.message) : ""}
              variant="bordered"
              placeholder={t("auth.placeholder-email")}
              type="email"
              {...register("email")}
              classNames={{
                inputWrapper:
                  "pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
              }}
            />
          </div>
          {t("auth.verificationCode")}
          <div className="relative">
            <Key size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={!!errors.code}
              variant="bordered"
              errorMessage={errors.code ? t(errors.code.message) : ""}
              type="text"
              placeholder={t("auth.placeholder-verificationCode")}
              {...register("code")}
              classNames={{
                inputWrapper:
                  "pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
              }}
            />
          </div>
          <label className="text-[#DD0303] font-medium">
            {t("auth.newPassword")}
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-[#DD0303]" />

            <Input
              isInvalid={!!errors.newPassword}
              variant="bordered"
              placeholder={t("auth.placeholder-newPassword")}
              errorMessage={
                errors.newPassword ? t(errors.newPassword.message) : ""
              }
              type={showPassword ? "text" : "password"}
              classNames={{
                inputWrapper:
                  "pl-12 pr-2 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)] relative ",
              }}
              {...register("newPassword")}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-3 focus:outline-none text-[#DD0303] ${
                    isArabic ? "left-8" : "right-3"
                  }`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full bg-[#DD0303] text-white py-3 rounded-lg hover:bg-[#bb0303]"
          >
            {t("auth.resetPasswordButton")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
