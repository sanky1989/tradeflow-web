import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// attach token
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isLoginAttempt = url.includes("/auth/login");

    if (status === 401 && !isLoginAttempt) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

export default api;