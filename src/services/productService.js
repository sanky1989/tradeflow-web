import api from "../utils/api";

export const productService = {
  getAll: async () => {
    const res = await api.get("/products");
    return res.data?.Data || res.data?.data || res.data || [];
  },
};