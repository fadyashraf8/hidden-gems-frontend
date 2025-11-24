import React, { useState } from "react";
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

const LoginPage = () => {
  const { t } = useTranslation("login");
  const dispatch = useDispatch();

  const [isloading, setisloading] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
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
          const res = await fetch("http://localhost:3000/auth/me", {
            credentials: "include",
          });
          if (res.ok) {
            const userData = await res.json();
            dispatch(login(userData.user));
          }
        } catch (e) {
          console.error("Failed to fetch user data", e);
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
      console.error("Login error:", err);
    }
  }

  const GOOGLE_URL = "https://your-backend.com/auth/google";
  const FACEBOOK_URL = "https://your-backend.com/auth/facebook";

  return (
    <div className="page-wrapper">
      <div className="auth-card mt-8">
        <form className="space-y-4" onSubmit={handleSubmit(handle)}>
          <h1 className="auth-title">{t("title")}</h1>

          <div className="flex flex-col gap-6 ">
            <Input
              isInvalid={Boolean(errors.email?.message)}
              errorMessage={t("email-error")}
              variant="bordered"
              label={t("email-placeholder")}
              type="email"
              {...register("email")}
            />

            <Input
              isInvalid={Boolean(errors.password?.message)}
              errorMessage={t("password-error")}
              variant="bordered"
              label={t("password-placeholder")}
              type="password"
              {...register("password")}
            />

            <Button
              isLoading={isloading}
              type="submit"
              variant="bordered"
              className="w-full border border-[#DD0303] text-black py-2 rounded-lg hover:bg-[#ff0303] transition cursor-pointer hover:text-white auth-submit-btn"
            >
              {t("Login-button")}
            </Button>

            <div className="flex items-center">
              <span className="flex-1 h-px bg-gray-300"></span>
              <span className="px-3 text-gray-500">{t("hr")}</span>
              <span className="flex-1 h-px bg-gray-300"></span>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                color="primary"
                variant="flat"
                onClick={() => (window.location.href = GOOGLE_URL)}
                className="w-full bg-white text-[#DD0303] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer google-btn"
              >
                {t("link-google")}
              </Button>

              <Button
                color="secondary"
                variant="flat"
                onClick={() => (window.location.href = FACEBOOK_URL)}
                className="w-full mt-4 bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition cursor-pointer facebook-btn"
              >
                {t("link-facebook")}
              </Button>
            </div>

            <p>
              {t("text-signup")}{" "}
              <Link to={"/signUp"} className="text-[#DD0303]   ">
                {t("link-signup")}
              </Link>
            </p>

            <p>
              {t("text-forgot-password")}{" "}
              <Link to={"/forget"} className="text-[#DD0303]">
                {t("link-forgot-password")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
