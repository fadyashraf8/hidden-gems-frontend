import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";

export default function AuthContextProvider({ children }) {
  const [isloggedin, setisloggedin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/me", {
          withCredentials: true, 
        });

        setisloggedin(true);
        setUser(res.data.user);
      } catch (err) {
        setisloggedin(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null; 

  return (
    <AuthContext.Provider value={{ isloggedin, setisloggedin, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
