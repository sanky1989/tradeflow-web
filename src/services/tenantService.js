import api from "../utils/api";

export const getTenantLimits = async () => {
  try {
    const res = await api.get("/tenants/current/limits");
    if (!res.data.Success) {
      throw new Error(res.data.Message || "Failed to fetch limits");
    }
    return res.data;
  } catch (error) {
    console.error("Tenant Limits Error:", error);
    throw error;
  }
};

export const getTenantUsage = async () => {
  try {
    const res = await api.get("/tenants/current/usage");
    if (!res.data.Success) {
      throw new Error(res.data.Message || "Failed to fetch usage");
    }
    return res.data;
  } catch (error) {
    console.error("Tenant Usage Error:", error);
    throw error;
  }
};

export const getashboard = async () => {
  try {
    const res = await api.get("/dashboard/summary");
    if (!res.data.Success) {
      throw new Error(res.data.Message || "Failed to fetch usage");
    }
    return res.data;
  } catch (error) {
    console.error("Tenant Usage Error:", error);
    throw error;
  }
};
