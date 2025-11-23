import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./redux/userSlice";

import Home from "./Pages/Home/Home";
import Layout from "./Components/Layout/Layout";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminGems from "./Pages/Admin/AdminGems";
import AdminCategories from "./Pages/Admin/AdminCategories";
import OwnerLayout from "./Pages/Owner/OwnerLayout";
import OwnerDashboard from "./Pages/Owner/OwnerDashboard";
import AddRestaurant from "./Pages/Owner/AddRestaurant";
import EditRestaurant from "./Pages/Owner/EditRestaurant";
import { Toaster } from "react-hot-toast";
import AboutLayout from "./Components/Layout/AboutLayout/AboutLayout";
import AboutUs from "./Pages/Footer/About/AboutUs";
import Careers from "./Pages/Footer/About/Careers";
import Press from "./Pages/Footer/About/Press";
import Terms from "./Pages/Footer/About/Terms";
import Privacy from "./Pages/Footer/About/Privacy";
import Content from "./Pages/Footer/About/Content";

import DiscoverLayout from "./Components/Layout/DiscoverLayout/DiscoverLayout";
import Blog from "./Pages/Footer/Discover/Blog";
import Support from "./Pages/Footer/Discover/Support";
import Hidden from "./Pages/Footer/Discover/Hidden";
import Cities from "./Pages/Footer/Discover/Cities";

import BusinessesLayout from "./Components/Layout/BusinessesLayout/BusinessesLayout";
import Business from "./Pages/Footer/Business/Business";
import AddPlace from "./Pages/Footer/Business/AddPlace";
import Advertising from "./Pages/Footer/Business/Advertising";
import Partners from "./Pages/Footer/Business/Partners";
import SignUp from "./Pages/signUp/signUp";
import Login from "./Pages/Login/Login";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import UserProfile from "./Pages/UserProfile/UserProfile";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";
import AuthLayout from "./Components/Layout/AuthLayout";
import MainLayout from "./Components/Layout/MainLayout";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";

function App() {
  const dark = useSelector((state) => state.darkMode.enabled);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [dark]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Main layout
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },

        {
          path: "about",
          element: <AboutLayout />, // layout wrapper
          children: [
            { index: true, element: <AboutUs /> },
            { path: "aboutUS", element: <AboutUs /> },
            { path: "careers", element: <Careers /> },
            { path: "press", element: <Press /> },
            { path: "terms", element: <Terms /> },
            { path: "privacy", element: <Privacy /> },
            { path: "content", element: <Content /> },
          ],
        },

        {
          path: "discover",
          element: <DiscoverLayout />,
          children: [
            { index: true, element: <Blog /> },
            { path: "blog", element: <Blog /> },
            { path: "support", element: <Support /> },
            { path: "hidden", element: <Hidden /> },
            { path: "cities", element: <Cities /> },
          ],
        },

        {
          path: "business",
          element: <BusinessesLayout />,
          children: [
            { index: true, element: <Business /> },
            { path: "business", element: <Business /> },
            {
              path: "addPlace",
              element: (
                <ProtectedRoute>
                  <AddPlace />
                </ProtectedRoute>
              ),
            },
            { path: "advertising", element: <Advertising /> },
            { path: "partners", element: <Partners /> },
          ],
        },

        // User Profile
        {
          path: "/",
          element: <MainLayout></MainLayout>,
          children: [
            {
              path: "profile",
              element: (
                <ProtectedRoute>
                  <UserProfile></UserProfile>
                </ProtectedRoute>
              ),
            },
          ],
        },

        // Auth Pages
        {
          path: "/",
          element: <AuthLayout></AuthLayout>,
          children: [
            {
              path: "signUp",
              element: (
                <PublicRoute>
                  <SignUp></SignUp>
                </PublicRoute>
              ),
            },
            {
              path: "login",
              element: (
                <PublicRoute>
                  <Login></Login>
                </PublicRoute>
              ),
            },
            {
              path: "forget",
              element: (
                <PublicRoute>
                  <ForgetPassword></ForgetPassword>
                </PublicRoute>
              ),
            },
            {
              path: "reset",
              element: (
                <PublicRoute>
                  <ResetPassword></ResetPassword>
                </PublicRoute>
              ),
            },
          ],
        },

        // 404 Page
        { path: "*", element: <NotFoundPage /> },
      ],
    },
    {
      path: "admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="users" replace /> },
        { path: "users", element: <AdminUsers /> },
        { path: "gems", element: <AdminGems /> },
        { path: "categories", element: <AdminCategories /> },
      ],
    },
    {
      path: "owner",
      element: (
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <OwnerDashboard /> },
        { path: "add-restaurant", element: <AddRestaurant /> },
        { path: "edit-restaurant", element: <EditRestaurant /> },
      ],
    },
  ]);

  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,

          // 🔴 ERROR STYLE
          error: {
            style: {
              background: "#DD0303",
              color: "white",
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "15px",
            },
            iconTheme: {
              primary: "white",
              secondary: "#DD0303",
            },
          },

          // 🟢 SUCCESS STYLE
          success: {
            style: {
              background: "#22c55e", // Tailwind green-500
              color: "white",
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "15px",
            },
            iconTheme: {
              primary: "white",
              secondary: "#22c55e",
            },
          },
        }}
      />

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
