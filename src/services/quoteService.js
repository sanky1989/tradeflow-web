import api from "../utils/api";

const unwrap = (res, fallbackMessage) => {
  if (res?.data?.Success === false || res?.data?.success === false) {
    throw new Error(
      res?.data?.Message || res?.data?.message || fallbackMessage
    );
  }

  return res.data?.Data || res.data?.data || res.data;
};

export const quoteService = {
  create: async (payload) => {
    const res = await api.post("/quotes", payload);
    return unwrap(res, "Failed to create quote");
  },

  getById: async (id) => {
    const res = await api.get(`/quotes/${id}`);
    return unwrap(res, "Failed to fetch quote");
  },

  addItem: async (quoteId, payload) => {
    const res = await api.post(`/quotes/${quoteId}/items`, payload);
    return unwrap(res, "Failed to add quote item");
  },
  calculate: async (quoteId) => {
    const res = await api.post(`/quotes/${quoteId}/calculate`);
    return unwrap(res, "Failed to calculate quote total");
  },
};