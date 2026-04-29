import React, { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { getRecentQuotes } from "../../services/dashboardService";
import Loader from "../common/Loader";
 
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
 
const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
 
const getStatusClass = (status) => {
  const normalisedStatus = (status || "").toLowerCase();
 
  if (
    normalisedStatus.includes("complete") ||
    normalisedStatus.includes("accepted") ||
    normalisedStatus.includes("paid")
  ) {
    return "bg-green-100 text-green-700 ring-green-200";
  }
 
  if (
    normalisedStatus.includes("sent") ||
    normalisedStatus.includes("pending") ||
    normalisedStatus.includes("draft")
  ) {
    return "bg-amber-100 text-amber-700 ring-amber-200";
  }
 
  return "bg-gray-100 text-gray-700 ring-gray-200";
};
 
export default function RecentTable() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const loadQuotes = async () => {
    setLoading(true);
    setError("");
 
    try {
      const res = await getRecentQuotes();
      setQuotes(res.Data || []);
    } catch (err) {
      console.error("Recent quotes error:", err);
      setError(err?.message || "Failed to load recent quotes.");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadQuotes();
  }, []);
 
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-300 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-[16px] font-semibold text-black">Recent Quotes</h3>
          <p className="mt-1 text-xs font-medium text-gray-500">
            Latest quotes created for this tenant
          </p>
        </div>
 
        <button
          type="button"
          onClick={loadQuotes}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-black"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
 
      {loading && (
        <div className="p-6">
          <Loader />
        </div>
      )}
 
      {!loading && error && (
        <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </div>
      )}
 
      {!loading && !error && quotes.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-sm font-semibold text-gray-700">No recent quotes found.</p>
          <p className="mt-1 text-xs text-gray-500">
            New quotes will appear here after they are created.
          </p>
        </div>
      )}
 
      {!loading && !error && quotes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                  Quote
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                  Amount
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                  Created
                </th>
              </tr>
            </thead>
 
            <tbody className="divide-y divide-gray-200">
              {quotes.slice(0, 8).map((row) => (
                <tr key={row.Id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-[13px] font-bold text-gray-900">
                    {row.QuoteNumber || "-"}
                  </td>
 
                  <td className="px-6 py-4 text-[13px] font-medium text-gray-900">
                    {row.CustomerName || "-"}
                  </td>
 
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
                        getStatusClass(row.Status)
                      )}
                    >
                      {row.Status || "Unknown"}
                    </span>
                  </td>
 
                  <td className="whitespace-nowrap px-6 py-4 text-[13px] font-bold text-gray-900">
                    {formatCurrency(row.TotalAmount)}
                  </td>
 
                  <td className="whitespace-nowrap px-6 py-4 text-[13px] font-medium text-gray-700">
                   {formatDate(
                      row.CreatedUtc ||
                      row.createdUtc ||
                      row.CreatedDate ||
                      row.createdDate ||
                      row.CreatedAt ||
                      row.createdAt
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
