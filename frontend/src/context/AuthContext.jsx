import { createContext, useContext, useEffect, useState } from "react";
import {
  signup as signupAPI,
  login as loginAPI,
  getMe,
  logout as logoutAPI,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Signup
  const signup = async (userData) => {
    const data = await signupAPI(userData);
    return data;
  };

  // Login
  const login = async (userData) => {
    const data = await loginAPI(userData);
    setUser(data.user);
    return data;
  };

  // Logout
  const logout = async () => {
    await logoutAPI();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};