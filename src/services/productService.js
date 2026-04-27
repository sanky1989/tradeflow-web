import api from "../utils/api";

export const productService = {
  getAll: async () => {
    const res = await api.get("/products");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/products", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/products/${id}`, payload);
    return res.data;
  },
};