import api from "../utils/api";

const unwrap = (res, fallbackMessage) => {
  if (!res.data?.Success) {
    throw new Error(res.data?.Message || fallbackMessage);
  }
  return res.data;
};

export const customerService = {
  getAll: async () => {
    try {
      const res = await api.get("/customers");
      return unwrap(res, "Failed to fetch customers");
    } catch (error) {
      console.error("Get Customers Error:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/customers/${id}`);
      return unwrap(res, "Failed to fetch customer");
    } catch (error) {
      console.error("Get Customer Error:", error);
      throw error;
    }
  },

  create: async (payload) => {
    try {
      const res = await api.post("/customers", payload);
      return unwrap(res, "Failed to create customer");
    } catch (error) {
      console.error("Create Customer Error:", error);
      throw error;
    }
  },

  update: async (id, payload) => {
    try {
      const res = await api.put(`/customers/${id}`, payload);
      return unwrap(res, "Failed to update customer");
    } catch (error) {
      console.error("Update Customer Error:", error);
      throw error;
    }
  },

  search: async (term) => {
    try {
      const query = encodeURIComponent(term || "");
      const res = await api.get(`/customers/search?term=${query}`);
      return unwrap(res, "Failed to search customers");
    } catch (error) {
      console.error("Search Customer Error:", error);
      throw error;
    }
  },

  addSite: async (customerId, payload) => {
    try {
      const res = await api.post(`/customers/${customerId}/sites`, payload);
      return unwrap(res, "Failed to add site");
    } catch (error) {
      console.error("Add Site Error:", error);
      throw error;
    }
  },

  getSites: async (id) => {
    try {
      const res = await api.get(`/customers/${id}/sites`);
      return unwrap(res, "Failed to fetch sites");
    } catch (error) {
      console.error("Get Sites Error:", error);
      throw error;
    }
  },
};
