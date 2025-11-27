import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/register.js";
import { registerAPI } from "../../Services/RegisterAuth.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation("Signup"); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
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

  const handle = async (data) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phoneNumber", data.phoneNumber);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      console.log("Sending registration data:", formData);
      const res = await registerAPI(formData);
      console.log("Registration response:", res);

      if (res.error) {
        console.error("Registration error:", res.error);
        toast.error(res.error || t("Toaster-error"));
      } else {
        console.log("Registration success, redirecting to verify...");
        toast.success(res.message || t("Toaster-success"));
        navigate("/verify", { state: { email: data.email } });
      }
    } catch (err) {
      console.error("Registration exception:", err);
      toast.error(t("Toaster-error") || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GOOGLE_URL = baseURL + "/auth/google";
  const FACEBOOK_URL = baseURL + "/auth/facebook";

  return (
    <div className="page-wrapper mt-12">
      <div className="auth-card mt-8">
        <form onSubmit={handleSubmit(handle)}>
          <h1 className="auth-title mb-1">{t("title")}</h1>

          <div className="flex flex-col gap-4">
            <Input
              isInvalid={!!errors.firstName?.message}
              errorMessage={
                errors.firstName?.message && t(errors.firstName?.message)
              }
              variant="bordered"
              label={t("firstName-placeholder")}
              {...register("firstName")}
              classNames={{
                errorMessage: "text-[#DD0303] ",
              }}
            />

            <Input
              isInvalid={!!errors.lastName?.message}
              errorMessage={
                errors.lastName?.message && t(errors.lastName?.message)
              }
              variant="bordered"
              label={t("lastName-placeholder")}
              {...register("lastName")}
              classNames={{
                errorMessage: "text-[#DD0303] ",
              }}
            />
            <Input
              isInvalid={!!errors.email?.message}
              errorMessage={errors.email?.message && t(errors.email?.message)}
              variant="bordered"
              label={t("email-placeholder")}
              {...register("email")}
              classNames={{
                errorMessage: "text-[#DD0303] ",
              }}
            />
            <Input
              isInvalid={!!errors.password?.message}
              errorMessage={
                errors.password?.message && t(errors.password?.message)
              }
              type={showPassword ? "text" : "password"} // هنا بنغير النوع
              variant="bordered"
              label={t("password-placeholder")}
              {...register("password")}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              classNames={{
                errorMessage: "text-[#DD0303]",
                inputWrapper: [
                  "data-[invalid=true]:border-[#DD0303]",
                  "data-[invalid=true]:hover:border-[#DD0303]",
                  "group-data-[focus=true]:data-[invalid=true]:border-[#DD0303]",
                ],
              }}
            />
            <Input
              isInvalid={!!errors.phoneNumber?.message}
              errorMessage={
                errors.phoneNumber?.message && t(errors.phoneNumber?.message)
              }
              variant="bordered"
              label={t("phoneNumber-placeholder")}
              {...register("phoneNumber")}
              classNames={{
                errorMessage: "text-[#DD0303] ",
              }}
            />
            <Input
              isInvalid={!!errors.image?.message}
              errorMessage={errors.image?.message && t(errors.image?.message)}
              variant="bordered"
              label={t("image-placeholder")}
              type="file"
              accept="image/*"
              {...register("image")}
              classNames={{
                errorMessage: "text-[#DD0303]",
                inputWrapper: [
                  "data-[invalid=true]:border-[#DD0303]",
                  "data-[invalid=true]:hover:border-[#DD0303]",
                  "group-data-[focus=true]:data-[invalid=true]:border-[#DD0303]",
                ],
              }}
            />

            <Button
              isLoading={isLoading}
              type="submit"
              variant="bordered"
              className="w-full border border-[#DD0303] text-black py-2 rounded-lg hover:bg-[#DD0303] hover:text-white transition cursor-pointer"
            >
              {t("Signup-button")}
            </Button>

            {/* <div className="my-2 flex items-center">
              <span className="flex-1 h-[0.5px] bg-gray-300"></span>
              <span className="px-3 text-gray-500">{t("hr")}</span>
              <span className="flex-1 h-px bg-gray-300"></span>
            </div> */}

            {/* <div className="flex flex-col mt-1">
              <Button
                color="primary"
                variant="flat"
                onClick={() => (window.location.href = GOOGLE_URL)}
                className="w-full bg-gray-200 text-[#DD0303] rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                {t("link-google")}
              </Button>

              <Button
                color="secondary"
                variant="flat"
                onClick={() => (window.location.href = FACEBOOK_URL)}
                className="w-full mt-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition cursor-pointer"
              >
                {t("link-facebook")}
              </Button>
            </div> */}

            <p className="mb-3">
              {t("text-login")}{" "}
              <Link to="/login" className="ps-1 text-[#DD0303]">
                {t("link-login")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
