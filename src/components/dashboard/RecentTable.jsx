import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { getRecentQuotes } from "../../services/dashboardService"; // <-- apna path check kar
import Loader from "../common/Loader";

export default function RecentTable() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const res = await getRecentQuotes();
        console.log("quotes", res);

        setQuotes(res?.Data || []);
      } catch (err) {
        console.log("error", err);
        setError("Failed to load quotes");
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []);

  return (
    <div className="rounded-xl border border-gray-300 bg-white overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-300">
        <h3 className="text-[16px] font-semibold text-black">
          Recent Quotes
        </h3>
      </div>

      {/* Loading */}
      {loading && (
       <Loader/>
      )}

      {/* Error */}
      {error && (
        <div className="p-6 text-sm text-red-500">{error}</div>
      )}

      {/* Empty State */}
      {!loading && quotes.length === 0 && (
        <div className="p-6 text-sm text-gray-500">
          No quotes found
        </div>
      )}

      {/* Table */}
      {!loading && quotes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] uppercase tracking-widest font-semibold text-black">
                  Quote Number
                </th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-widest font-semibold text-black">
                  Customer Name
                </th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-widest font-semibold text-black">
                  Status
                </th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-widest font-semibold text-black">
                  Total Amount
                </th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-widest font-semibold text-black">
                  Created Utc
                </th>
              </tr>
            </thead>

            <tbody className="divide-y border-gray-300">
              {quotes.slice(0, 5).map((row) => (
                <tr key={row.Id} className="group transition-colors hover:bg-gray-50">
                  
                  {/* Quote Number */}
                  <td className="px-8 py-4 text-[13px] font-medium text-gray-900 ">
                    {row.QuoteNumber}
                  </td>

                  {/* Customer Name */}
                  <td className="px-8 py-4 text-[13px] font-medium text-gray-900">
                    {row.CustomerName}
                  </td>

                  {/* Status */}
                  <td className="px-8 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold ring-1 ring-inset bg-green-100 bg-red-100 text-red-600 ring-red-200",
                       
                      )}
                    >
                      {row.Status}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-8 py-4 text-[13px] font-bold text-gray-900">
                    {row.TotalAmount}
                  </td>

                  {/* Date */}
                  <td className="px-8 py-4 text-[13px] font-medium text-gray-900">
                    {new Date(row.CreatedUtc).toLocaleDateString("en-US")}
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