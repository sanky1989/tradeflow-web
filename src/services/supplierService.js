import api from "../utils/api";

const unwrap = (res, fallbackMessage) => {
  const body = res?.data;
  const success = body?.Success ?? body?.success;
  const message = body?.Message ?? body?.message;
  const data = body?.Data ?? body?.data;

  if (success === false) {
    throw new Error(message || fallbackMessage);
  }

  return { ...body, Data: data ?? body };
};

export const supplierService = {
  getAll: async () => {
    const res = await api.get("/suppliers");
    return unwrap(res, "Failed to fetch suppliers");
  },

  getById: async (id) => {
    const res = await api.get(`/suppliers/${id}`);
    return unwrap(res, "Failed to fetch supplier");
  },

  create: async (payload) => {
    const res = await api.post("/suppliers", payload);
    return unwrap(res, "Failed to create supplier");
  },

  update: async (id, payload) => {
    const res = await api.put(`/suppliers/${id}`, payload);
    return unwrap(res, "Failed to update supplier");
  },
};
