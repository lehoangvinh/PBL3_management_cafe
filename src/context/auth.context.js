import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

function AuthProvider(props) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(
    localStorage.getItem("token")
      ? jwtDecode(localStorage.getItem("token")).user.role[0].name
      : ""
  );
  const [user, setUser] = useState(
    localStorage.getItem("token")
      ? jwtDecode(localStorage.getItem("token")).user
      : {}
  );

  const login = async (username, password) => {
    const body = {
      usernameOrEmail: username,
      password,
    };
    const res = await axios.post("/auth/login", body);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setRole("");
    localStorage.removeItem("token");
  };

  const setState = (token) => {
    setToken(token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setRole(decoded.user.role[0].name);
  };

  // useEffect(() => {
  //   const token2 = localStorage.getItem("token");
  //   if (token2) {
  //     setState(token2);
  //   } else setToken("");
  // }, []);

  const value = {
    token,
    user,
    role,
    login,
    logout,
    setState,
  };

  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useCart must be used within a CartProvider");
  return context;
}

export { AuthProvider, useAuth };
