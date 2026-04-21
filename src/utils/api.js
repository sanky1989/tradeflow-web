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

export default api;