import React from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 ">
      <div className=" bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mt-8 ">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* JWT Login */}
        <form className="space-y-4">
        
        
      
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg "
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg "
            required
          />

          <button className="w-full bg-[#DD0303] text-white py-2 rounded-lg hover:bg-[#ff0303] transition  cursor-pointer">
            Login
          </button>
        </form>

        <div className="my-6 flex items-center">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="px-3 text-gray-500">OR</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        {/* Google Login */}
        <div id="googleBtn" className="flex justify-center">
          <button className="w-full bg-white text-[#DD0303] py-2 rounded-lg hover:bg-gray-100 transition  cursor-pointer">
            Continue with Google
          </button>
        </div>

        {/* Facebook Login */}
        <button className="w-full mt-4 bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition  cursor-pointer">
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
