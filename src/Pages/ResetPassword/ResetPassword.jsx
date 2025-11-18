import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
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
  });

  async function handle(data) {
    setIsLoading(true);
    setErrMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:3000/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setErrMsg(json.error || "Invalid code or email");
      } else {
        setSuccessMsg(json.message || "Password changed successfully");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      console.error(err);
      setErrMsg(err?.message || "unexpected error");
    }
  }

  return (
    <div className="max-w-xl mt-20 pt-10 flex flex-col justify-center shadow-xl gap-1 p-6 rounded-xl mx-auto border-1">
      <form onSubmit={handleSubmit(handle)}>
        <h1 className="text-3xl font-bold text-center my-3">Reset Password</h1>

        <div className="flex flex-col gap-6">
          <Input
            isInvalid={Boolean(errors.email?.message)}
            variant="bordered"
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
          />

          <Input
            isInvalid={Boolean(errors.code?.message)}
            variant="bordered"
            label="Verification Code"
            type="text"
            {...register("code", { required: "Code is required" })}
          />

          <Input
            isInvalid={Boolean(errors.newPassword?.message)}
            variant="bordered"
            label="New Password"
            type="password"
            {...register("newPassword", {
              required: "New password is required",
            })}
          />

          <Button
            isLoading={isLoading}
            type="submit"
            color="danger"
            variant="bordered"
          >
            Reset Password
          </Button>

          <p className="text-center">
            <Link to="/login" className="text-danger-500 hover:underline">
              Back to Login
            </Link>
          </p>

          {errMsg && (
            <p className="text-red-500 text-center bg-red-200 p-1 rounded-xl">
              {errMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-green-500 text-center bg-green-200 p-1 rounded-xl">
              {successMsg}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
