import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate(); 
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handle(data) {
    setIsLoading(true);
    setErrMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:3000/auth/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setErrMsg(json.error || "Something went wrong");
        return;
      }

      setSuccessMsg(json.message || "Request sent successfully");

   
      setTimeout(() => {
        navigate("/reset");
      }, 2000);
    } catch (error) {
      console.error("Forget password error:", error);
      setErrMsg(error?.message || "Unexpected error");
    }
  }

  return (
    <div className="max-w-xl mt-20 pt-10 flex flex-col justify-center shadow-xl gap-1 p-6 rounded-xl mx-auto border-1 border-gray-300">
      <form onSubmit={handleSubmit(handle)}>
        <h1 className="text-3xl font-bold text-center my-3">Forget Password</h1>

        <div className="flex flex-col gap-6">
          {/* Email */}
          <Input
            isInvalid={Boolean(errors.email?.message)}
            errorMessage={errors.email?.message}
            variant="bordered"
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
          />

          {/* Old password */}
        

          {/* Submit button */}
          <Button
            isLoading={isLoading}
            type="submit"
            color="danger"
            variant="bordered"
          >
            Send Request
          </Button>

          <p className="mb-3 text-center">
            <Link to="/login" className="text-[#DD0303]">
              Back to Login
            </Link>
          </p>

          {/* Error Message */}
          {errMsg && (
            <p className="text-red-500 text-center bg-red-200 p-1 rounded-xl">
              {errMsg}
            </p>
          )}

          {/* Success Message */}
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

export default ForgetPassword;
