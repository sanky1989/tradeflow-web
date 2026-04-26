import api from "../utils/api";
 
const unwrapApiResponse = (response, fallbackMessage) => {
  if (!response?.data?.Success) {
    throw new Error(response?.data?.Message || fallbackMessage);
  }
 
  return response.data;
};
 
export const getTenantLimits = async () => {
  const res = await api.get("/tenants/current/limits");
  return unwrapApiResponse(res, "Failed to fetch tenant limits");
};
 
export const getTenantUsage = async () => {
  const res = await api.get("/tenants/current/usage");
  return unwrapApiResponse(res, "Failed to fetch tenant usage");
};
