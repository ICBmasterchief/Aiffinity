// frontend/src/context/AuthContext.js
"use client";

import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import client, { renewWebSocket } from "@/graphql/apollo-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearApollo = async () => {
    await client.clearStore();
    renewWebSocket();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUserFromToken(token);
    setLoading(false);
  }, []);

  const setUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) setUser(decoded);
      else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    setUserFromToken(token);
    await clearApollo();
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    await clearApollo();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
