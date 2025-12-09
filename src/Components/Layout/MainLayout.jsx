import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ScrollToTop from "../ScrollToTop";

const MainLayout = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
};

export default MainLayout;
