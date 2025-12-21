import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useSelector, useDispatch } from "react-redux";
import { fetchWishlistCount, fetchWishlistItems } from "./redux/wishlistSlice";
import { checkAuth } from "./redux/userSlice";
import { useTranslation } from "react-i18next";

import Home from "./Pages/Home/Home";
import Layout from "./Components/Layout/Layout";
import MainLayout from "./Components/Layout/MainLayout";
import AuthLayout from "./Components/Layout/AuthLayout";

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
import Spot from "./Pages/Footer/Discover/Spot";
import Cities from "./Pages/Footer/Discover/Cities";
import BusinessesLayout from "./Components/Layout/BusinessesLayout/BusinessesLayout";
import Business from "./Pages/Footer/Business/Business";
import AddPlace from "./Pages/Footer/Business/AddPlace";
import EditPlace from "./Pages/Footer/Business/EditPlace";
import Advertising from "./Pages/Footer/Business/Advertising";
import Partners from "./Pages/Footer/Business/Partners";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PublicRoute from "./Components/Auth/PublicRoute";
import LoadingScreen from "./Pages/LoadingScreen";

import GemDetails from "./Pages/GemDetails/GemDetails";
import UserProfile from "./Pages/UserProfile/UserProfile";
import CreatedByYou from "./Pages/CreatedByYou/CreatedByYou";

import ContactUsPage from "./Pages/ContactUs/ContactUs";
import CategoriesPage from "./Pages/CategoriesPage/CategoriesPage";
import SurpriseMe from "./Pages/SurpriseMe/SurpriseMe";
import SponsoredGems from "./Pages/SponsoredGems/SponsoredGems";
import Success from "./Pages/Subscription/Success";
import Cancel from "./Pages/Subscription/Cancel";

import { Toaster } from "react-hot-toast";
import LayoutAdmin from "./Pages/AdminPages/LayoutAdmin/LayoutAdmin";
import Users from "./Pages/AdminPages/Users/AllUsers/Users";
import HomeAdmin from "./Pages/AdminPages/HomeAdmin/HomeAdmin";
import EditUser from "./Pages/AdminPages/Users/EditUser/EditUser";
import AddUser from "./Pages/AdminPages/Users/AddUser/AddUser";
import AllCategories from "./Pages/AdminPages/Categories/AllCategories/AllCategories";
import EditCategory from "./Pages/AdminPages/Categories/EditCategory/EditCategory";
import AddCategory from "./Pages/AdminPages/Categories/AddCategory/AddCategory";
import AllGems from "./Pages/AdminPages/Gems/AllGems/AllGems";
import EditGem from "./Pages/AdminPages/Gems/EditGem/EditGem";
import AddGem from "./Pages/AdminPages/Gems/AddGem/AddGem";
import UserGems from "./Pages/AdminPages/Gems/UserGems/UserGems";
import LayoutOwner from "./Pages/OwnerPages/LayoutOwner/LayoutOwner";
import HomeOwner from "./Pages/OwnerPages/HomeOwner/HomeOwner";
import GemOwner from "./Pages/OwnerPages/GemOwner/GemOwner";
import AddGemOwner from "./Pages/OwnerPages/AddGemOwner/AddGemOwner";
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";
import VoucherRedeem from "./Pages/AdminPages/Vouchers/VoucherRedeem/VoucherRedeem";
import Vouchers from "./Pages/Vouchers/Vouchers";
import Wishlist from "./Pages/wishListPage/wishList";
import AllVouchers from "./Pages/AdminPages/Vouchers/AllVouchers/AllVouchers";
import AllTransactions from "./Pages/Transactions/AllTransactions/AllTransactions";
import TransactionDashboard from "./Pages/Transactions/TransactionDashboard/TransactionDashboard";
import AllReports from "./Pages/AdminPages/Reports/AllReports/AllReports";
import ReportDetails from "./Pages/AdminPages/Reports/ReportDetails/ReportDetails";
function App() {
  const dark = useSelector((state) => state.darkMode.enabled);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const { isLoggedIn, loading } = useSelector((state) => state.user);

  // Check Auth on App load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchWishlistItems());

      dispatch(fetchWishlistCount());
    }
  }, [dispatch, isLoggedIn]);

  // Dark Mode toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
      document.body.classList.remove("dark");
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
        { path: "sponsored", element: <SponsoredGems /> },
        { path: "gems/:id", element: <GemDetails /> },
        { path: "contact-us", element: <ContactUsPage /> },
        { path: "vouchers", element: <Vouchers /> },
        { path: "transactions", element: <AllTransactions /> },
        { path: "wishlist", element: <Wishlist /> },
        { path: "places", element: <CategoriesPage /> },
        { path: "surprise", element: <SurpriseMe /> },
        { path: "places/:categoryName", element: <CategoriesPage /> },
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
            { path: "Spot", element: <Spot /> },
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
            {
              path: "editPlace/:gemId",
              element: (
                <ProtectedRoute>
                  <EditPlace />
                </ProtectedRoute>
              ),
            },
            { path: "advertising", element: <Advertising /> },
            { path: "partners", element: <Partners /> },
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
            {
              path: "created-by-you",
              element: (
                <ProtectedRoute allowedRoles={["user"]}>
                  <CreatedByYou />
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
              path: "verify",
              element: (
                <PublicRoute>
                  <VerifyEmail />
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

      ],
    },
    // {
    //   path: "admin",
    //   element: (
    //     <ProtectedRoute allowedRoles={["admin"]}>
    //       <AdminLayout />
    //     </ProtectedRoute>
    //   ),
    //   children: [
    //     { index: true, element: <Navigate to="users" replace /> },
    //     { path: "users", element: <AdminUsers /> },
    //     { path: "gems", element: <AdminGems /> },
    //     { path: "my-gems", element: <AdminMyGems /> },
    //     { path: "categories", element: <AdminCategories /> },
    //   ],
    // },
    {
      path: "admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <LayoutAdmin />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <HomeAdmin /> },
        //user
        { path: "users", element: <Users /> },
        { path: "users/add", element: <AddUser /> },
        { path: "users/:id", element: <EditUser /> },

        //category
        { path: "categories", element: <AllCategories /> },
        { path: "categories/:id", element: <EditCategory /> },
        { path: "categories/add", element: <AddCategory /> },

        //Gems

        { path: "gems", element: <AllGems /> },
        { path: "gems/:id", element: <EditGem /> },
        { path: "gems/add", element: <AddGem /> },
        { path: "gems/user", element: <UserGems /> },

        //Voucher Redeem
        { path: "vouchers", element: <AllVouchers /> },
        { path: "vouchers/:id", element: <VoucherRedeem /> },

        { path: "transactions", element: <TransactionDashboard /> },
        // Reports
        { path: "reports", element: <AllReports /> },
        { path: "reports/:id", element: <ReportDetails /> },
      ],
    },
    // {
    //   path: "owner",
    //   element: (
    //     <ProtectedRoute allowedRoles={["owner"]}>
    //       <OwnerLayout />
    //     </ProtectedRoute>
    //   ),
    //   children: [
    //     { path: "dashboard", element: <OwnerDashboard /> },
    //     { path: "add-restaurant", element: <AddRestaurant /> },
    //     { path: "edit-restaurant", element: <EditRestaurant /> },
    //   ],
    // },
    {
      path: "owner",
      element: (
        <ProtectedRoute allowedRoles={["owner"]}>
          <LayoutOwner />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <HomeOwner /> },
        { path: "gem", element: <GemOwner /> },
        { path: "gem/add", element: <AddGem /> },
        { path: "vouchers", element: <AllVouchers /> },

        { path: ":id", element: <VoucherRedeem /> },
        { path: "transactions", element: <TransactionDashboard /> },
      ],
    },
    {
      path: "shopping",
      element: <CategoriesPage />,
    },
    {
      path: "success",
      element: <Success />,
    },
    {
      path: "cancel",
      element: <Cancel />,
    },
    
        // 404 Page
        { path: "*", element: <NotFoundPage /> }
  ]);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <Toaster
          position="top-center"
          containerStyle={{ top: 80 }}
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
