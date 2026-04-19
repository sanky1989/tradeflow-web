import api from "../utils/api";

export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};

export const getRecentQuotes = async () => {
  const res = await api.get("/dashboard/recent-quotes");
  return res.data;
};