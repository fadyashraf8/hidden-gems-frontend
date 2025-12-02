import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/login.js";
import { loginAPI } from "../../Services/LoginAuth.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("login");
  const baseUrl = import.meta.env.VITE_Base_URL;
  const dispatch = useDispatch();
  const [isloading, setisloading] = useState(false);
  const navigate = useNavigate();

  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
  ];
  const [bgIndex, setBgIndex] = useState(0);

  // تغيير الصورة كل 3 ثواني
  useEffect(() => {
    const interval = setInterval(
      () => setBgIndex((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main); // تحميل جميع المميزات
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
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  async function handle(Data) {
    try {
      setisloading(true);
      const data = await loginAPI(Data);
      if (
        data &&
        (data.message === "Login successful" || data.message === "success")
      ) {
        toast.success(t("Toaster-success"));
        try {
          const res = await fetch(baseUrl + "/auth/me", {
            credentials: "include",
          });
          if (res.ok) {
            const userData = await res.json();
            dispatch(login(userData.user));
          }
        } catch (e) {
          console.error(e);
        } finally {
          setisloading(false);
        }
        navigate("/", { replace: true });
        return;
      }
      setisloading(false);
      toast.error(t("Toaster-error"));
    } catch (err) {
      setisloading(false);
      toast.error("Network error! Please try again.");
      console.error(err);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setisloading(true);
      const response = await fetch(baseUrl + "/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();
      if (response.ok && data.message === "Login successful") {
        toast.success("Logged in with Google successfully!");
        try {
          const res = await fetch(baseUrl + "/auth/me", {
            credentials: "include",
          });
          if (res.ok) {
            const userData = await res.json();
            dispatch(login(userData.user));
          }
        } catch (e) {
          console.error(e);
        }
        navigate("/", { replace: true });
      } else {
        toast.error(data.error || "Google login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with Google login");
    } finally {
      setisloading(false);
    }
  };

  const handleGoogleError = () => toast.error("Google login failed!");

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
        {/* Back to home */}
        <div className="mb-4 flex items-center gap-2 cursor-pointer">
          <span className="text-[#DD0303] text-lg">←</span>
          <span className="text-[#DD0303] font-medium">
            <Link to="/">{t("Home")}</Link>
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

        {/* Welcome Text + Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="auth-title text-center text-2xl font-bold text-white">
            {t("title")}
          </h1>
          <p className="text-center text-gray-400 mb-4">{t("subtitle")}</p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleSubmit(handle)}>
          {/* Email */}
          <label className="text-[#DD0303] font-medium">
            {t("email-label")}
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-[#DD0303]" />
            <Input
              isInvalid={Boolean(errors.email?.message)}
              errorMessage={t("email-error")}
              variant="bordered"
              type="email"
              placeholder={t("email-placeholder")}
              {...register("email")}
              classNames={{
                inputWrapper:
                  "pl-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
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
              isInvalid={Boolean(errors.password?.message)}
              errorMessage={t("password-error")}
              variant="bordered"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder={t("password-placeholder")}
              classNames={{
                inputWrapper:
                  "pl-10 pr-10 transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(221,3,3,0.5)]",
              }}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 focus:outline-none text-[#DD0303]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forget" className="text-[#DD0303] text-sm">
              {t("link-forgot-password")}
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            isLoading={isloading}
            type="submit"
            className="w-full bg-[#DD0303] text-white py-3 rounded-lg hover:bg-[#bb0303]"
          >
            {t("Login-button")}
          </Button>

          {/* Divider */}
          <div className="flex items-center">
            <span className="flex-1 h-px bg-[#DD0303]"></span>
            <span className="px-3 text-[#DD0303]">{t("hr")}</span>
            <span className="flex-1 h-px bg-[#DD0303]"></span>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="medium"
              width="280"
              text="signin_with"
              shape="pill"
            />
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-400">
            {t("text-signup")}{" "}
            <Link to="/signUp" className="text-[#DD0303]">
              {t("link-signup")}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
