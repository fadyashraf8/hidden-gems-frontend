import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { schema } from "../../Schema/reset";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
    },
    resolver: zodResolver(schema),
  });

  async function handle(data) {
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        toast.error(json.error || "Invalid code or email");
      } else {
        toast.success(json.message || "Password changed successfully");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.message || "Something went wrong");
    }
  }

  Object.values(errors).forEach((err) => {
    if (err?.message) toast.error(err.message);
  });

  return (
    <div className="page-wrapper">
      <div className="auth-card mt-8">
        <form onSubmit={handleSubmit(handle)}>
          <h1 className="auth-title my-3">Reset Password</h1>

          <div className="flex flex-col gap-6">
            <Input
              isInvalid={Boolean(errors.email?.message)}
              variant="bordered"
              label="Email"
              type="email"
              {...register("email")}
            />

            <Input
              isInvalid={Boolean(errors.code?.message)}
              variant="bordered"
              label="Verification Code"
              type="text"
              {...register("code")}
            />

            <Input
              isInvalid={Boolean(errors.newPassword?.message)}
              variant="bordered"
              label="New Password"
              type="password"
              {...register("newPassword")}
            />

            <Button
              isLoading={isLoading}
              type="submit"
              className="w-full border border-[#DD0303] text-black py-2 rounded-lg hover:bg-[#ff0303] transition cursor-pointer hover:text-white auth-submit-btn"
              variant="bordered"
            >
              Reset Password
            </Button>

            <p className="text-center">
              <Link to="/login" className="text-danger-500 hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
