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
    try {
      const res = await api.post("/products", payload);
      if (!res.data.Success && !res.data.success) {
        throw {
          message: res.data.Message || res.data.message,
          errors: res.data.Errors || res.data.errors,
        };
      }

      return res.data;

    } catch (error) {
      // 🔥 BACKEND ERROR (THIS IS YOUR CASE)
      if (error.response) {
        throw {
          message:
            error.response.data?.Message ||
            error.response.data?.message ||
            "Something went wrong",
          errors:
            error.response.data?.Errors ||
            error.response.data?.errors ||
            null,
        };
      }
      throw {
        message: error.message || "Network error",
        errors: null,
      };
    }
  },

  update: async (id, payload) => {
    const res = await api.put(`/products/${id}`, payload);
    return res.data;
  },
};