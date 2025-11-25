import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyEmailAPI } from "../../Services/RegisterAuth";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(location.state?.email || "");

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

    toast.success(res.message || "Email verified!");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div className="page-wrapper">
      <div className="auth-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="auth-title">Verify Email</h1>
          <p className="text-center mb-6 text-gray-600">
            Enter the code sent to your email
          </p>

          <div className="flex flex-col gap-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              label="Email"
              type="email"
              isRequired
            />

            <Input
              variant="bordered"
              label="Verification Code"
              isInvalid={!!errors.code}
              errorMessage={errors.code?.message}
              {...register("code", { required: "Code is required" })}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              variant="bordered"
              className="w-full border border-[#DD0303] py-2 rounded-lg hover:bg-[#DD0303] hover:text-white"
            >
              Verify
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
