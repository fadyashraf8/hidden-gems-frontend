import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "@/Pages/LoadingScreen";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.user);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
