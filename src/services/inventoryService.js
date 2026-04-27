import api from "../utils/api";
 
const unwrap = (res, fallbackMessage) => {
  const body = res?.data;
 
  // Backend may return Success/Data or success/data depending on serialization.
  const success = body?.Success ?? body?.success;
  const message = body?.Message ?? body?.message;
  const data = body?.Data ?? body?.data;
 
  if (success === false) {
    throw new Error(message || fallbackMessage);
  }
 
  return data ?? body;
};
 
export const inventoryService = {
  getAll: async () => {
    const res = await api.get("/inventory");
    return unwrap(res, "Failed to fetch inventory");
  },
 
  getByProductId: async (productId) => {
    const res = await api.get(`/inventory/${productId}`);
    return unwrap(res, "Failed to fetch inventory item");
  },
 
  upsert: async (payload) => {
    const res = await api.post("/inventory", payload);
    return unwrap(res, "Failed to save inventory");
  },
 
  update: async (productId, payload) => {
  const res = await api.put(`/inventory/${productId}`, payload);
  return unwrap(res, "Failed to update inventory");
},

adjust: async (productId, payload) => {
  const res = await api.post(`/inventory/${productId}/adjust`, payload);
  return unwrap(res, "Failed to adjust inventory");
},
};
