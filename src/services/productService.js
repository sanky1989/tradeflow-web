import api from "../utils/api";

export const productService = {
  // 🔹 GET ALL PRODUCTS
  getAll: async () => {
    const res = await api.get("/products");
    return res.data;
  },

  // 🔹 GET PRODUCT BY ID
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  // 🔹 CREATE PRODUCT
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

  // 🔹 UPDATE PRODUCT
  update: async (id, payload) => {
    try {
      const res = await api.put(`/products/${id}`, payload);

      if (!res.data.Success && !res.data.success) {
        throw {
          message: res.data.Message || res.data.message,
          errors: res.data.Errors || res.data.errors,
        };
      }

      return res.data;
    } catch (error) {
      if (error.response) {
        throw {
          message:
            error.response.data?.Message ||
            error.response.data?.message ||
            "Update failed",
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

  // GET INVENTORY
getInventory: async (id) => {
  try {
    const res = await api.get(`/products/${id}/inventory`);
    return res.data;

  } catch (error) {

    // 🔥 404 = inventory not found → NORMAL case
    if (error.response?.status === 404) {
      return {
        Success: true,
        Data: null, // 👈 important
      };
    }

    // ❌ real error
    throw {
      message:
        error.response?.data?.Message ||
        error.response?.data?.message ||
        "Failed to load inventory",
      errors:
        error.response?.data?.Errors ||
        error.response?.data?.errors ||
        null,
    };
  }
},
};