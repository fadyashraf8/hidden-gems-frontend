import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
