import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

const AuthLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet></Outlet>
    </>
  );
};

export default AuthLayout;
