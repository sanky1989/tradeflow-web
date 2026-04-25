import api from "../utils/api";

export const customerService = {
  
  // 🔹 GET ALL CUSTOMERS
  getAll: async () => {
    try {
      const res = await api.get("/customers");
      if (!res.data.Success) {
        throw new Error(res.data.Message);
      }
      return res.data;
    } catch (error) {
      console.error("Get Customers Error:", error);
      throw error;
    }
  },

  // 🔹 GET CUSTOMER BY ID
  getById: async (id) => {
    try {
      const res = await api.get(`/customers/${id}`);
      if (!res.data.Success) {
        throw new Error(res.data.Message);
      }
      return res.data;
    } catch (error) {
      console.error("Get Customer Error:", error);
      throw error;
    }
  },

  // 🔥 NEW → CREATE CUSTOMER
  create: async (payload) => {
    try {
      const res = await api.post("/customers", payload);
      if (!res.data.Success) {
        throw new Error(res.data.Message);
      }
      return res.data;
    } catch (error) {
      console.error("Create Customer Error:", error);
      throw error;
    }
  },

  // 🔹 UPDATE CUSTOMER
  update: async (id, payload) => {
    try {
      const res = await api.put(`/customers/${id}`, payload);
      if (!res.data.Success) {
        throw new Error(res.data.Message);
      }
      return res.data;
    } catch (error) {
      console.error("Update Customer Error:", error);
      throw error;
    }
  },

  // 🔹 SEARCH CUSTOMER
search: async (term) => {
  try {
    const res = await api.get(`/customers/search?term=${term}`);
    if (!res.data.Success) {
      throw new Error(res.data.Message);
    }
    return res.data;
  } catch (error) {
    console.error("Search Customer Error:", error);
    throw error;
  }
},

// 🔹 ADD CUSTOMER SITE
addSite: async (customerId, payload) => {
  try {
    const res = await api.post(`/customers/${customerId}/sites`, payload);
    if (!res.data.Success) {
      throw new Error(res.data.Message);
    }
    return res.data;
  } catch (error) {
    console.error("Add Site Error:", error);
    throw error;
  }
},

// 🔹 GET CUSTOMER SITES
getSites: async (id) => {
  try {
    const res = await api.get(`/customers/${id}/sites`);
    if (!res.data.Success) {
      throw new Error(res.data.Message);
    }
    return res.data;
  } catch (error) {
    console.error("Get Sites Error:", error);
    throw error;
  }
},

};