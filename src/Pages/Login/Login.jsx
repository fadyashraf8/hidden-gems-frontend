import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/login.js";
import { loginAPI } from "../../Services/LoginAuth.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/userSlice";
import "./Login.css";
import toast from "react-hot-toast";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [isloading, setisloading] = useState(false);
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
<<<<<<< Updated upstream
         toast.success("Logged in successfully!");
        
                setisloading(true);
        // Fetch user info after login or use data.user if available
        // Assuming loginAPI returns user data or we need to fetch it. 
        // The previous code fetched it manually. Let's keep that pattern but dispatch to Redux.
=======
>>>>>>> Stashed changes
        try {
          const res = await fetch("http://localhost:3000/auth/me", {
            credentials: "include",
          });
          if (res.ok) {
            const userData = await res.json();
            dispatch(login(userData.user));
          }
        } finally {
          setisloading(false);
        }
        navigate("/", { replace: true });
        return;
      }

      toast.error(data?.message || data?.error || "Something went wrong!");
        } catch (err) {
          setisloading(false);
          toast.error("Network error! Please try again.");
          console.error("Login error:", err);
        }
  }

  // ========= GOOGLE & FACEBOOK URLs =========
  const GOOGLE_URL = "https://your-backend.com/auth/google";
  const FACEBOOK_URL = "https://your-backend.com/auth/facebook";

  return (
  <div className=" flex justify-center items-center min-h-screen bg-gray-100 px-4 ">
        <div className=" bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mt-8 ">
          <form className="space-y-4" onSubmit={handleSubmit(handle)}>
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
  
            <div className="flex flex-col gap-6 ">
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
                variant="bordered"
                className="w-full border border-[#DD0303] text-black py-2 rounded-lg hover:bg-[#ff0303] transition cursor-pointer hover:text-white"
              >
                Login
              </Button>
  
              <div className=" flex items-center">
                <span className="flex-1 h-px bg-gray-300"></span>
                <span className="px-3 text-gray-500">OR</span>
                <span className="flex-1 h-px bg-gray-300"></span>
              </div>
  
              <div className="flex flex-col gap-4">
                <Button
                  color="primary"
                  variant="flat"
                  onClick={() => (window.location.href = GOOGLE_URL)}
                  className="w-full bg-white text-[#DD0303] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  Continue with Google
                </Button>
  
                <Button
                  color="secondary"
                  variant="flat"
                  onClick={() => (window.location.href = FACEBOOK_URL)}
                  className="w-full mt-4 bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition cursor-pointer"
                >
                  Continue with Facebook
                </Button>
              </div>
  
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
            </div>
          </form>
        </div>
      </div>


    );
};

export default LoginPage;
