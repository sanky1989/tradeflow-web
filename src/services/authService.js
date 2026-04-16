import api from "../utils/api";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};