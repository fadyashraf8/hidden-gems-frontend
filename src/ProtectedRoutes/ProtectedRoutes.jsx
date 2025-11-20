import React from "react";
import { useSelector } from "react-redux";
import Login from "../Pages/Login/Login";

const ProtectedRoutes = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return isLoggedIn ? children : <Login />;
};

export default ProtectedRoutes;
