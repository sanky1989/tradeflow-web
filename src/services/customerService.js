import api from "../utils/api";



export const customerService = async () => {
  try {
    const res = await api.get("/customers");
    if (!res.data.Success) {
      throw new Error(res.data.Message || "Failed to fetch limits");
    }
    return res.data;
  } catch (error) {
    console.error("Customer Limits Error:", error);
    throw error;
  }
};