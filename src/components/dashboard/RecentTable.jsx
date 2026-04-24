import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { getRecentQuotes } from "../../services/dashboardService";
import Loader from "../common/Loader";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value || 0);
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status) => {
  const value = (status || "").toLowerCase();

  if (["approved", "accepted", "completed", "installed"].includes(value)) {
    return "bg-success/15 text-success ring-success/20";
  }

  if (["pending", "draft", "sent", "viewed", "depositpending"].includes(value)) {
    return "bg-warning/15 text-warning ring-warning/20";
  }

  return "bg-rose-500/15 text-rose-500 ring-rose-500/20";
};

export default function RecentTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecentQuotes = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getRecentQuotes();
        setRows(res?.Data || []);
      } catch (err) {
        console.error("Recent quotes error", err);
        setError("Failed to load recent quotes.");
      } finally {
        setLoading(false);
      }
    };

    loadRecentQuotes();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border border-gray-300 bg-white overflow-hidden">
      <div className="p-6 border-b border-border border-gray-300">
        <h3 className="text-[15px] font-semibold text-gray-900 leading-none">Recent Quotes</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border border-gray-300 bg-white">
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">
                Quote
              </th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">
                Client
              </th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">
                Status
              </th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">
                Value
              </th>
              <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">
                Timestamp
              </th>
            </tr>
          </thead>

          <tbody className="divide-y border-gray-300">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.Id} className="group transition-colors">
                  <td className="px-8 py-4 text-[13px] font-medium text-gray-900">
                    {row.QuoteNumber || "-"}
                  </td>
                  <td className="px-8 py-4 text-[13px] font-medium text-gray-900">
                    {row.CustomerName || "-"}
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold ring-1 ring-inset",
                        getStatusClass(row.Status)
                      )}
                    >
                      {row.Status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-[13px] font-bold text-gray-900">
                    {formatCurrency(row.TotalAmount)}
                  </td>
                  <td className="px-8 py-4 text-[13px] font-medium text-gray-900">
                    {formatDate(row.CreatedUtc)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-8 text-center text-sm text-gray-500">
                  No recent quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
