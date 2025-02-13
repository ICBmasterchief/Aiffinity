// src/context/AuthContext.js
"use client";

import { createContext, useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Error decodificando el token en login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
