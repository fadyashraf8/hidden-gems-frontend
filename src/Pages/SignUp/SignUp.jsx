import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/register.js";
import { registerAPI } from "../../Services/RegisterAuth.js";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [isloading, setisloading] = useState(false);
  const [errMsg, seterrMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      image: null,
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  async function handle(Data) {
    setisloading(true);

    const formData = new FormData();
    formData.append("firstName", Data.firstName);
    formData.append("lastName", Data.lastName);
    formData.append("email", Data.email);
    formData.append("password", Data.password);
    formData.append("phoneNumber", Data.phoneNumber);

    if (Data.image && Data.image.length > 0) {
      formData.append("image", Data.image[0]);
    }

    const data = await registerAPI(formData);
    setisloading(false);

    if (data.error) {
      seterrMsg(data.error);
      setsuccessMsg("");
    } else {
      reset();
      setsuccessMsg(data.message);
      setTimeout(() => navigate("/login"), 800);
      seterrMsg("");
    }
  }

  const GOOGLE_URL = "https://your-backend.com/auth/google";
  const FACEBOOK_URL = "https://your-backend.com/auth/facebook";

  return (
    <div className="max-w-xl py-8 flex flex-col justify-center shadow-xl gap-2 p-4 rounded-xl mx-auto mt-20 border border-gray-300">
      <form onSubmit={handleSubmit(handle)}>
        <h1 className="text-3xl font-bold text-center my-2">Register</h1>

        <div className="flex flex-col gap-2">
          <Input
            isInvalid={Boolean(errors.firstName?.message)}
            errorMessage={errors.firstName?.message}
            variant="bordered"
            label="First Name"
            {...register("firstName")}
          />

          <Input
            isInvalid={Boolean(errors.lastName?.message)}
            errorMessage={errors.lastName?.message}
            variant="bordered"
            label="Last Name"
            {...register("lastName")}
          />

          <Input
            isInvalid={Boolean(errors.email?.message)}
            errorMessage={errors.email?.message}
            variant="bordered"
            label="Email"
            type="email"
            {...register("email")}
          />

          <Input
            isInvalid={Boolean(errors.password?.message)}
            errorMessage={errors.password?.message}
            variant="bordered"
            label="Password"
            type="password"
            {...register("password")}
          />

          <Input
            isInvalid={Boolean(errors.phoneNumber?.message)}
            errorMessage={errors.phoneNumber?.message}
            variant="bordered"
            label="Phone Number"
            type="tel"
            {...register("phoneNumber")}
          />

          <Input
            isInvalid={Boolean(errors.image?.message)}
            errorMessage={errors.image?.message}
            variant="bordered"
            label="Profile Picture"
            type="file"
            accept="image/*"
            {...register("image")}
          />

          <Button
            isLoading={isloading}
            type="submit"
            color="danger"
            variant="bordered"
          >
            Register
          </Button>

          {/* ======= SOCIAL REGISTER (Google & Facebook) ======= */}
          <div className="flex flex-col gap-4 mt-2">
            <Button
              color="primary"
              variant="flat"
              onClick={() => (window.location.href = GOOGLE_URL)}
            >
              Continue with Google
            </Button>

            <Button
              color="secondary"
              variant="flat"
              onClick={() => (window.location.href = FACEBOOK_URL)}
            >
              Continue with Facebook
            </Button>
          </div>
          {/* =================================================== */}

          <p className="mb-3">
            Already have an account?
            <Link to={"/login"} className="ps-1 text-[#DD0303]">
              Login
            </Link>
          </p>

          {errMsg && (
            <p className="text-red-500 text-center mt-0 bg-red-200 rounded-3xl">
              {errMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-green-500 text-center mt-0 bg-green-200 rounded-3xl">
              {successMsg}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
