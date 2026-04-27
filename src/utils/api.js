import axios from "axios";

const api = axios.create({
  baseURL: "https://tradeflow-api-test-cuguc3g3e6eadrc6.australiaeast-01.azurewebsites.net/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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