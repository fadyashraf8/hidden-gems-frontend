import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  async function handle(data) {
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        toast.error(json.error || "Something went wrong");
        return;
      }

      toast.success(json.message || "Request sent successfully");
      setTimeout(() => navigate("/reset"), 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Forget password error:", error);
      toast.error(error?.message || "Unexpected error");
    }
  }

  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100  ">
      <div className=" bg-white p-10 rounded-2xl shadow-lg w-full max-w-md  ">
        {" "}
        <form onSubmit={handleSubmit(handle)}>
          <h1 className="text-3xl font-bold text-center mb-9 ">
            Forget Password
          </h1>

          <div className="flex flex-col gap-6">
            <Input
              isInvalid={Boolean(errors.email?.message)}
              errorMessage={errors.email?.message}
              variant="bordered"
              label="Email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />

            <Button
              isLoading={isLoading}
              type="submit"
              color="danger"
              variant="bordered"
              className="w-full border border-[#DD0303] text-[#DD0303] py-2 rounded-lg hover:bg-[#ff0303] transition cursor-pointer hover:text-white"
            >
              Send Request
            </Button>

            <p className="mb-3 text-center">
              <Link to="/login" className="text-[#DD0303]">
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
