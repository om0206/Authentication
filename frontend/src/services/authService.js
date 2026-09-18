import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const signup = async (userData) => {
  const response = await API.post("/auth/signup", userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

export const getMe = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await API.post(
    "/auth/change-password",
    passwordData
  );

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await API.post(
    `/auth/reset-password/${token}`,
    { password }
  );

  return response.data;
};

export const resendVerification = async (email) => {
  const response = await API.post(
    "/auth/resend-verification",
    { email }
  );

  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await API.get(
    `/auth/verify-email/${token}`
  );

  return response.data;
};