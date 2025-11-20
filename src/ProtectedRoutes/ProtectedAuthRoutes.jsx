import { Navigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

const ProtectedAuthRoutes = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedAuthRoutes;
