
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./Pages/Home/Home";
import Layout from "./Components/Layout/Layout";

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
// Protect routes


function App() {
  const dark = useSelector((state) => state.darkMode.enabled);

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
            { path: "addPlace", element: <AddPlace /> },
            { path: "advertising", element: <Advertising /> },
            { path: "partners", element: <Partners /> },
          ],
        },

        // Login Page
        { path: "signUp", element: <SignUp/> },
        { path: "login", element: <Login/> },
      ],
    },
  ]);



  return (
    <div className={dark ? "dark-mode" : ""}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
