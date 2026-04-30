import api from "../utils/api";

const validateResponse = (res, fallbackMessage) => {
  const data = res?.data;

  if (data?.Success === false || data?.success === false) {
    throw {
      message: data?.Message || data?.message || fallbackMessage,
      errors: data?.Errors || data?.errors || null,
    };
  }

  return data;
};

const getErrorPayload = (error, fallbackMessage) => {
  if (error?.response) {
    return {
      message:
        error.response.data?.Message ||
        error.response.data?.message ||
        fallbackMessage,
      errors:
        error.response.data?.Errors ||
        error.response.data?.errors ||
        null,
    };
  }

  return {
    message: error?.message || fallbackMessage,
    errors: null,
  };
};

export const productService = {
  getAll: async () => {
    try {
      const res = await api.get("/products");
      return validateResponse(res, "Unable to load products");
    } catch (error) {
      throw getErrorPayload(error, "Unable to load products");
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      return validateResponse(res, "Unable to load product");
    } catch (error) {
      throw getErrorPayload(error, "Unable to load product");
    }
  },

  create: async (payload) => {
    try {
      const res = await api.post("/products", payload);
      return validateResponse(res, "Unable to create product");
    } catch (error) {
      throw getErrorPayload(error, "Unable to create product");
    }
  },

  update: async (id, payload) => {
    try {
      const res = await api.put(`/products/${id}`, payload);
      return validateResponse(res, "Unable to update product");
    } catch (error) {
      throw getErrorPayload(error, "Unable to update product");
    }
  },

  getInventory: async (id) => {
    try {
      const res = await api.get(`/products/${id}/inventory`);
      return validateResponse(res, "Unable to load inventory");
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          Success: true,
          Data: null,
        };
      }

      throw getErrorPayload(error, "Unable to load inventory");
    }
  },

  getComponents: async (id) => {
    try {
      const res = await api.get(`/products/${id}/components`);
      return validateResponse(res, "Unable to load components");
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          Success: true,
          Data: [],
        };
      }

      throw getErrorPayload(error, "Unable to load components");
    }
  },

  updateComponents: async (id, payload) => {
    try {
      const res = await api.post(`/products/${id}/components`, payload);
      return validateResponse(res, "Unable to save components");
    } catch (error) {
      throw getErrorPayload(error, "Unable to save components");
    }
  },
};