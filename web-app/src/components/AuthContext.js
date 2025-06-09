/**
 * @file AuthContext.js
 * @description Used throughout the web-app to determine if a user is logged in.
 * Provides authentication and login/logout helper methods. 
 * @authors Cathy Duan, Charlie Ney
 * @date 6/9/25
 */
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => { // Check if a token exists and update the login state
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  };

  return ( // Provide the authentication state and actions to children components 
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
