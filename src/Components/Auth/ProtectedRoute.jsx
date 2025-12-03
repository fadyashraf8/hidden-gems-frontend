import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "@/Pages/LoadingScreen";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userInfo, loading } = useSelector((state) => state.user);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo?.role)) {
    return <Navigate to="/" replace />; // Or an unauthorized page
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
