import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("datamed_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
