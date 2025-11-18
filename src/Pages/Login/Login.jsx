import React, { useState, useContext } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/login.js";
import { loginAPI } from "../../Services/LoginAuth.js";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

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
      setisloading(false);

      if (
        data &&
        (data.message === "Login successful" || data.message === "success")
      ) {
        setisloggedin(true);
        navigate("/", { replace: true });
        return;
      }

      seterrMsg(data?.message || data?.error || "error");
    } catch (err) {
      setisloading(false);
      seterrMsg(err?.message || "unexpected error");
      console.error("Login error:", err);
    }
  }

  // ========= GOOGLE & FACEBOOK URLs =========
  const GOOGLE_URL = "https://your-backend.com/auth/google";
  const FACEBOOK_URL = "https://your-backend.com/auth/facebook";

  return (
    <div className=" max-w-xl py-8 flex flex-col justify-center shadow-xl gap-8 p-4 rounded-xl mx-auto mt-30 border-1 border-gray-300 ">
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
            color="danger"
            variant="bordered"
          >
            Login
          </Button>

          {/* ================== GOOGLE & FACEBOOK BUTTONS ================== */}
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
          {/* ================================================================ */}

          <p>
            U don't have an account?
            <Link to={"/signUp"} className="text-[#DD0303]">
              {" "}
              Create new account
            </Link>
          </p>

          <p>
            don't remember your password?
            <Link to={"/forget"} className=" text-[#DD0303]">
              Forget Password
            </Link>
          </p>

          {errMsg && (
            <p className="text-center mt-0 bg-red-400 rounded-3xl">{errMsg}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
