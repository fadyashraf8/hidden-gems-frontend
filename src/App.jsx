import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./redux/userSlice";
import { useTranslation } from "react-i18next";

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
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import UserProfile from "./Pages/UserProfile/UserProfile";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";
import AuthLayout from "./Components/Layout/AuthLayout";
import MainLayout from "./Components/Layout/MainLayout";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";
import { Cat } from "lucide-react";

import ContactUsPage from "./Pages/ContactUs/ContactUs";
import CategoriesPage from "./Pages/CategoriesPage/CategoriesPage";

import { Toaster } from "react-hot-toast";

function App() {

  console.log(import.meta.env.VITE_CLIENT_ID);

  const dark = useSelector((state) => state.darkMode.enabled);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const language = i18n.language || "en";

  // Check Auth on App load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Dark Mode toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [dark]);

  // RTL / LTR based on language
  useEffect(() => {
    if (language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", "en");
    }
  }, [language]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "contact-us", element: <ContactUsPage />},
        { path: "places", element: <CategoriesPage />},
        { path: "places/:categoryName", element: <CategoriesPage />},
        {
          path: "about",
          element: <AboutLayout />,
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
            { path: "partners", element: <Partners /> }
          ],
        },

        {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              path: "profile",
              element: (
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              ),
            },
          ],
        },

        {
          path: "/",
          element: <AuthLayout />,
          children: [
            {
              path: "signUp",
              element: (
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              ),
            },
            {
              path: "login",
              element: (
                <PublicRoute>
                  <Login />
                </PublicRoute>
              ),
            },
            {
              path: "forget",
              element: (
                <PublicRoute>
                  <ForgetPassword />
                </PublicRoute>
              ),
            },
            {
              path: "reset",
              element: (
                <PublicRoute>
                  <ResetPassword />
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
    {
      path: "shopping",
      element: (
        <CategoriesPage/>
      )
    }
  ]);

  return (
    <div>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
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
          success: {
            style: {
              background: "#22c55e",
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
          </GoogleOAuthProvider>

    </div>
  );
}

export default App;
