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

export const userService = {
  getAll: async () => {
    const res = await api.get("/users");
    return unwrap(res, "Failed to fetch users");
  },

  getById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return unwrap(res, "Failed to fetch user");
  },

  create: async (payload) => {
    const res = await api.post("/users", payload);
    return unwrap(res, "Failed to create user");
  },

  getRoles: async () => {
    const res = await api.get("/lookups/roles");
    return unwrap(res, "Failed to fetch roles");
  },
};
