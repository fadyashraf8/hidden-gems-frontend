import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../Schema/register.js";
import { registerAPI } from "../../Services/RegisterAuth.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [isloading, setisloading] = useState(false);
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
            toast.error(data.error);
      
    } else {
    toast.success(data.message || "Account created successfully!");
        reset();
    
        setTimeout(() => navigate("/login"), 1000);
    }
  }

  const GOOGLE_URL = "https://your-backend.com/auth/google";
  const FACEBOOK_URL = "https://your-backend.com/auth/facebook";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 mt-12">
         <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mt-8 ">
           <form onSubmit={handleSubmit(handle)}>
             <h1 className="text-2xl font-bold mb-1 text-center">SignUp</h1>
   
             <div className="flex flex-col gap-4">
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
                 variant="bordered"
                 className="w-full border border-[#DD0303] text-black py-2 rounded-lg hover:bg-[#DD0303] transition cursor-pointer hover:text-white"
               >
                 SignUp
               </Button>
   
               <div className="my-2 flex items-center">
                 <span className="flex-1 h-[0.5px] bg-gray-300"></span>
                 <span className="px-3 text-gray-500">OR</span>
                 <span className="flex-1 h-px bg-gray-300"></span>
               </div>
   
               <div className="flex flex-col mt-1">
                 <Button
                   color="primary"
                   variant="flat"
                   onClick={() => (window.location.href = GOOGLE_URL)}
                   className="w-full bg-gray-200 text-[#DD0303] rounded-lg hover:bg-gray-100 transition cursor-pointer"
                 >
                   Continue with Google
                 </Button>
   
                 <Button
                   color="secondary"
                   variant="flat"
                   onClick={() => (window.location.href = FACEBOOK_URL)}
                   className="w-full mt-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition cursor-pointer"
                 >
                   Continue with Facebook
                 </Button>
               </div>
   
               <p className="mb-3">
                 Already have an account?
                 <Link to={"/login"} className="ps-1 text-[#DD0303]">
                   Login
                 </Link>
               </p>
             </div>
           </form>
         </div>
       </div>
  );
};

export default RegisterPage;
