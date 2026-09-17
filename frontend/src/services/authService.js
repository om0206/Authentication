import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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