import api from "../utils/api";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", {
    Email: data.email,
    Password: data.password,
  });

  return response.data;
};