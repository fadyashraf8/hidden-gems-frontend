import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/register.js";
import { registerAPI } from "../../Services/RegisterAuth.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

import "../Login/Login.css";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("Signup");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

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

  const {
    handleSubmit,
    register: formRegister,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      image: null,
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const selectedFile = watch("image");
  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else setPreviewImage(null);
  }, [selectedFile]);

  const handle = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phoneNumber", data.phoneNumber);
    if (data.image && data.image.length > 0)
      formData.append("image", data.image[0]);

    try {
      const res = await registerAPI(formData);
      if (res.error) toast.error(t("Toaster-error"));
      else {
        toast.success(t("Toaster-success"));
        navigate("/verify", { state: { email: data.email } });
      }
    } catch (err) {
      toast.error(t("Toaster-error") || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper relative min-h-screen flex items-center justify-center overflow-hidden">
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
        {/* Back to home */}
        <div className="flex items-center cursor-pointer mb-4">
          <span className="text-[#DD0303] text-lg">{t("arrow")}</span>
          <span className="text-[#DD0303] font-medium">
            <Link to="/">{t("Home")}</Link>
          </span>
        </div>

        {/* Logo */}
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

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="auth-title text-center text-2xl font-bold text-white">
            {t("title")}
          </h1>
          <p className="text-center text-gray-400 mb-2">{t("subtitle")}</p>
        </motion.div>

        <form className="space-y-3" onSubmit={handleSubmit(handle)}>
          {/* First Name */}
          <label className="text-[#DD0303] font-medium">
            {t("firstName-label")}
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={!!errors.firstName?.message}
              errorMessage={
                errors.firstName?.message && t(errors.firstName?.message)
              }
              variant="bordered"
              placeholder={t("firstName-placeholder")}
              {...formRegister("firstName")}
              classNames={{
                inputWrapper:
                  "pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
                errorMessage: "text-[#DD0303]",
              }}
            />
          </div>

          {/* Last Name */}
          <label className="text-[#DD0303] font-medium">
            {t("lastName-label")}
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={!!errors.lastName?.message}
              errorMessage={
                errors.lastName?.message && t(errors.lastName?.message)
              }
              variant="bordered"
              placeholder={t("lastName-placeholder")}
              {...formRegister("lastName")}
              classNames={{
                inputWrapper:
                  "pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
                errorMessage: "text-[#DD0303]",
              }}
            />
          </div>

          {/* Email */}
          <label className="text-[#DD0303] font-medium">
            {t("email-label")}
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={!!errors.email?.message}
              errorMessage={errors.email?.message && t(errors.email?.message)}
              variant="bordered"
              placeholder={t("email-placeholder")}
              {...formRegister("email")}
              classNames={{
                inputWrapper:
                  "pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
                errorMessage: "text-[#DD0303]",
              }}
            />
          </div>

          {/* Password */}
          <label className="text-[#DD0303] font-medium">
            {t("password-label")}
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={!!errors.password?.message}
              errorMessage={
                errors.password?.message && t(errors.password?.message)
              }
              type={showPassword ? "text" : "password"}
              variant="bordered"
              placeholder={t("password-placeholder")}
              {...formRegister("password")}
              classNames={{
                inputWrapper:
                  "pl-10 pr-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
                errorMessage: "text-[#DD0303]",
              }}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3 focus:outline-none text-[#DD0303]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {/* Phone */}
          <label className="text-[#DD0303] font-medium">
            {t("phoneNumber-label")}
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={!!errors.phoneNumber?.message}
              errorMessage={
                errors.phoneNumber?.message && t(errors.phoneNumber?.message)
              }
              variant="bordered"
              placeholder={t("phoneNumber-placeholder")}
              {...formRegister("phoneNumber")}
              classNames={{
                inputWrapper:
                  "pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
                errorMessage: "text-[#DD0303]",
              }}
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <label className="mb-2 text-[#DD0303] font-medium">
              {t("image-placeholder")}
            </label>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover mb-2 border-2 border-[#DD0303]"
              />
            ) : (
              <div className="w-32 h-32 rounded-full flex items-center justify-center mb-2 border-2 border-[#DD0303]">
                <span className="text-sm">No Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              {...formRegister("image")}
              className="w-full px-4 py-2 border-2 border-[#DD0303] rounded-lg text-black cursor-pointer hover:bg-[#DD0303]/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#DD0303]"
            />
            {errors.image?.message && (
              <span className="text-[#DD0303] mt-1 text-sm">
                {t(errors.image?.message)}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full bg-[#DD0303] text-white py-3 rounded-lg hover:bg-[#bb0303] transition"
          >
            {t("Signup-button")}
          </Button>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-2">
            {t("text-login")}
            <Link to="/login" className="px-3 text-[#DD0303] color">
              {t("link-login")}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
