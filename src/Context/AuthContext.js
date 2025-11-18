
import { createContext } from "react";

const AuthContext = createContext({
	isloggedin: false,
	setisloggedin: () => {},
	user: null,
	setUser: () => {},
});

export default AuthContext;
