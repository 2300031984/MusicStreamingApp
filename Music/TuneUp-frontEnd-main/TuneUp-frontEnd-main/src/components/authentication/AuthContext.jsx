import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [expiresAt, setExpiresAt] = useState(() => localStorage.getItem("expiresAt"));

  useEffect(() => {
    if (user && token && expiresAt) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiresAt);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
    }
  }, [user, token, expiresAt]);

  useEffect(() => {
    if (expiresAt) {
      const timeout = setTimeout(() => {
        logout();
      }, new Date(expiresAt).getTime() - Date.now());
      return () => clearTimeout(timeout);
    }
  }, [expiresAt]);

  const login = (userData, jwtToken, expiresIn) => {
    setUser(userData);
    setToken(jwtToken);
    const expiry = new Date(Date.now() + expiresIn * 1000).toISOString();
    setExpiresAt(expiry);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setExpiresAt(null);
  };

  const isAuthenticated = !!user && !!token && (!expiresAt || new Date(expiresAt) > new Date());

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}