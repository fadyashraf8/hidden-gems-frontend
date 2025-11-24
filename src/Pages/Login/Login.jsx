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
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("login");
  const baseUrl = import.meta.env.VITE_Base_URL;
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
          const res = await fetch(baseUrl + "/auth/me", {
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setisloading(true);

      const response = await fetch(baseUrl + "/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
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
          console.error("Failed to fetch user data", e);
        }

        navigate("/", { replace: true });
      } else {
        toast.error(data.error || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong with Google login!");
    } finally {
      setisloading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed!");
  };

  return (
    <div className="page-wrapper">
      <div className="auth-card mt-8">
        <form className="space-y-4" onSubmit={handleSubmit(handle)}>
          <h1 className="auth-title">{t("title")}</h1>

          <div className="flex flex-col gap-6">
            <Input
              isInvalid={Boolean(errors.email?.message)}
              errorMessage={t("email-error")}
              variant="bordered"
              label={t("email-placeholder")}
              type="email"
              {...register("email")}
              classNames={{
                errorMessage: "text-[#DD0303]",
              }}
            />

            <Input
              isInvalid={Boolean(errors.password?.message)}
              errorMessage={t("password-error")}
              variant="bordered"
              label={t("password-placeholder")}
              type={showPassword ? "text" : "password"}
              {...register("password")}
              classNames={{
                errorMessage: "text-[#DD0303]",
              }}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
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
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  width="100%"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>
            </div>

            <p>
              {t("text-signup")}{" "}
              <Link to={"/signUp"} className="text-[#DD0303]">
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
