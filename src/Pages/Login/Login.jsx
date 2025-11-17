import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/login.js";
import { loginAPI } from "../../Services/LoginAuth.js";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import { useContext } from "react";

const LoginPage = () => {
  const { setisloggedin } = useContext(AuthContext);

  const [isloading, setisloading] = useState(false);
  const [errMsg, seterrMsg] = useState("");
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "fadyashraf909999@gmail.com",
      password: "Password#123",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  async function handle(Data) {
    try {
      setisloading(true);
      const data = await loginAPI(Data);
      setisloading(false);

      // Backend responds with { message: 'Login successful' } and sets cookie
      if (
        data &&
        (data.message === "Login successful" || data.message === "success")
      ) {
        // Backend uses httpOnly cookie for auth; set a local flag so client considers user logged in
        localStorage.setItem("userToken", "true");
        setisloggedin(true);
        navigate("/", { replace: true });
        return;
      }

      seterrMsg(data?.message || data?.error ||"error" );
    } catch (err) {
      setisloading(false);
      seterrMsg(err?.message || "un expected error");
      console.error("Login error:", err);
    }
  }

  return (
    <div className=" max-w-xl py-10 flex flex-col justify-center shadow-xl  gap-8 p-4 rounded-xl mx-auto mt-20">
      <form onSubmit={handleSubmit(handle)}>
        <h1 className="text-3xl font-bold text-center my-3">Login</h1>
        <div className="flex flex-col gap-6">
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

          <Button
            isLoading={isloading}
            type="submit"
            color="primary"
            variant="bordered"
          >
            Login
          </Button>
          <p>
            U don't have an account?
            <Link to={"/signUp"} className="  text-primary-500">
              Create new account
            </Link>{" "}
          </p>
          <p>
            {" "}
            don't remember your password?
            <Link to={"/profile"} className="  text-primary-500">
              Reset Password
            </Link>{" "}
          </p>

          {errMsg && (
            <p className=" text-center mt-0 bg-green-200 rounded-3xl">
              {errMsg}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
