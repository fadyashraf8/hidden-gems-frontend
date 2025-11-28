import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userInfo, loading } = useSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading spinner
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
