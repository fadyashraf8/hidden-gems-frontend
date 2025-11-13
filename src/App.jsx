import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Layout from "./Components/Layout/Layout";
import AboutLayout from "./Components/Footer/AboutLayout/AboutLayout";
import AboutUs from "./Components/Footer/Pages/About/AboutUs";
import Careers from "./Components/Footer/Pages/About/Careers";
import Press from "./Components/Footer/Pages/About/Press";
import Terms from "./Components/Footer/Pages/About/terms";
import Privacy from "./Components/Footer/Pages/About/Privacy";
import Content from "./Components/Footer/Pages/About/Content";
import DiscoverLayout from "./Components/Footer/DiscoverLayout/DiscoverLayout";
import Blog from "./Components/Footer/Pages/Discover/Blog";
import Support from "./Components/Footer/Pages/Discover/Support";
import Hidden from "./Components/Footer/Pages/Discover/Hidden";
import Cities from "./Components/Footer/Pages/Discover/Cities";
import BusinessesLayout from "./Components/Footer/DiscoverLayout/BusinessesLayout/BusinessesLayout";
import Business from "./Components/Footer/Pages/Business/Business";
import AddPlace from "./Components/Footer/Pages/Business/AddPlace";
import Advertising from "./Components/Footer/Pages/Business/Advertising";
import Partners from "./Components/Footer/Pages/Business/Partners";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home></Home> },
        { path: "/home", element: <Home></Home> },
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
            { path: "Content", element: <Content /> },
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
            { index: true, element: <Blog /> },
            { path: "business", element: <Business /> },
            { path: "addPlace", element: <AddPlace /> },
            { path: "advertising", element: <Advertising /> },
            { path: "partners", element: <Partners /> },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
