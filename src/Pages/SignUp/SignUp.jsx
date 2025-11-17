import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
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
    // Build multipart form data so file is sent as a file, not as JSON field
    const formData = new FormData();
    formData.append("firstName", Data.firstName);
    formData.append("lastName", Data.lastName);
    formData.append("email", Data.email);
    formData.append("password", Data.password);
    formData.append("phoneNumber", Data.phoneNumber);
    if (Data.image && Data.image.length > 0) {
      // Data.image is a FileList from the file input
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
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      seterrMsg("");
    }
  }
  return (
    <div className=" max-w-xl py-2 flex flex-col justify-center shadow-xl  gap-5 p-4 rounded-xl mx-auto ">
      <form onSubmit={handleSubmit(handle)}>
        <h1 className="text-3xl font-bold text-center my-3">Register</h1>
        <div className="flex flex-col gap-6">
          <Input
            isInvalid={Boolean(errors.firstName?.message)}
            errorMessage={errors.firstName?.message}
            variant="bordered"
            label="First Name"
            type="name"
            {...register("firstName")}
          />
          <Input
            isInvalid={Boolean(errors.lastName?.message)}
            errorMessage={errors.lastName?.message}
            variant="bordered"
            label="Last Name"
            type="name"
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
            color="primary"
            variant="bordered"
          >
            Register
          </Button>
          <p className=" mb-3">
            Already have an account?
            <Link to={"/login"} className=" ps-1  text-primary-500">
              Login
            </Link>
          </p>
          {errMsg && (
            <p className="text-red-500 text-center mt-0 bg-red-200 rounded-3xl">
              {errMsg}
            </p>
          )}
          {successMsg && (
            <p className="text-green-500 text-center mt-0  bg-green-200 rounded-3xl">
              {successMsg}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
