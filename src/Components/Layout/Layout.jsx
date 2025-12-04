import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

export default function Layout() {
  const location = useLocation();
  const pathname = (location.pathname || "").toLowerCase();

  // list of paths where footer should be hidden
  const hideFooterPaths = [
    "/login",
    "/signup",
    "/signUp",
    "/profile",
    "/verify",
    "/reset",
    "/forget",
  ];

  const shouldHideFooter = hideFooterPaths.some((p) => pathname.startsWith(p));

  return (
    <div className="">
      <Navbar />

      <Outlet />

      {!shouldHideFooter && <Footer />}
    </div>
  );
}
