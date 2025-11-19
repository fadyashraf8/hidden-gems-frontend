
import { useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthContextProvider({ children }) {
  const [isloggedin, setisloggedin] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ isloggedin, setisloggedin, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
