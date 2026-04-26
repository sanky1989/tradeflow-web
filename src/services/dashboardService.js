import api from "../utils/api";
 
const unwrapApiResponse = (response, fallbackMessage) => {
  if (!response?.data?.Success) {
    throw new Error(response?.data?.Message || fallbackMessage);
  }
 
  return response.data;
};
 
export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return unwrapApiResponse(res, "Failed to fetch dashboard summary");
};
 
export const getRecentQuotes = async () => {
  const res = await api.get("/dashboard/recent-quotes");
  return unwrapApiResponse(res, "Failed to fetch recent quotes");
};
 
export const getPaymentSummary = async () => {
  const res = await api.get("/dashboard/payment-summary");
  return unwrapApiResponse(res, "Failed to fetch payment summary");
};
