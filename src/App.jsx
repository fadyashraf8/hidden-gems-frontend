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
import Admin from "./Pages/Admin/Admin";
import { Toaster } from "react-hot-toast";
import AboutLayout from "./Components/Layout/AboutLayout/AboutLayout";
import AboutUs from "./Pages/Footer/About/AboutUs";
import Careers from "./Pages/Footer/About/Careers";
import Press from "./Pages/Footer/About/Press";
import Terms from "./Pages/Footer/About/terms";
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
import ProtectedAuthRoutes from './ProtectedRoutes/ProtectedAuthRoutes';
import AuthLayout from './Components/Layout/AuthLayout';
import MainLayout from './Components/Layout/MainLayout';
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes';





import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";

function App() {
  const dark = useSelector((state) => state.darkMode.enabled);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

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

        // Login Page
        {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          path: "/",
          element: <MainLayout></MainLayout>,
          children: [
            {
              path: "profile",
              element: (
                <ProtectedRoutes>
                  <UserProfile></UserProfile>
                </ProtectedRoutes>
              ),
            },
          ],
        },


        {
          path: "/",
          element: <AuthLayout></AuthLayout>,
          children: [
            {
              path: "signUp",
              element: (
                <ProtectedAuthRoutes>
                  <SignUp></SignUp>
                </ProtectedAuthRoutes>
              ),
            },
            {
              path: "login",
              element: (
                <ProtectedAuthRoutes>
                  <Login></Login>
                </ProtectedAuthRoutes>
              ),
            },
            {
              path: "forget",
              element: (
                <ProtectedAuthRoutes>
                  <ForgetPassword></ForgetPassword>
                </ProtectedAuthRoutes>
              ),
            },
            {
              path: "reset",
              element: (
                <ProtectedAuthRoutes>
                  <ResetPassword></ResetPassword>
                </ProtectedAuthRoutes>
              ),
            },
          ],
        },
        // Admin Dashboard
        { path: "admin", element: <Admin /> },

        // 404 Page
        { path: "*", element: <NotFoundPage /> },
=======
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
        // Admin Dashboard
=======
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
        // Admin Dashboard
>>>>>>> Stashed changes
=======
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
        // Admin Dashboard
>>>>>>> Stashed changes
=======
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
        // Admin Dashboard
>>>>>>> Stashed changes
        {
          path: "admin",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          ),
        },
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      ],
    },
  ]);

  return (
    <div className={dark ? "dark-mode" : ""}>
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
