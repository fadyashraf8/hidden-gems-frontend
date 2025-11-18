import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import  store  from "./redux/store";
import './index.css'
import App from './App.jsx'
import { HeroUIProvider } from "@heroui/react";
import AuthContextProvider from "./Context/authContext.jsx";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HeroUIProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </HeroUIProvider>
  </Provider>
);
