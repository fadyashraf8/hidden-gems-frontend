import {  useState } from "react"
import AuthContext from "./AuthContext";






export default function AuthContextProvider({children}) {
    const [isloggedin, setisloggedin] = useState(
      localStorage.getItem("userToken") !== null
    );
  return (
    <AuthContext.Provider value={{ isloggedin, setisloggedin }}>
      {children}
    </AuthContext.Provider>
  );
}
