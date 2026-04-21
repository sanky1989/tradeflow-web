import React from "react";
import { cn } from "../../lib/utils";

const RECENT_QUOTES = [
  { id: "1", customer: "John Doe", status: "Approved", amount: "$1,200", date: "12 Apr" },
  { id: "2", customer: "Jane Smith", status: "Pending", amount: "$850", date: "11 Apr" },
  { id: "3", customer: "Robert Taylor", status: "Approved", amount: "$2,100", date: "10 Apr" },
  { id: "4", customer: "Emily Brown", status: "Rejected", amount: "$450", date: "09 Apr" },
  { id: "5", customer: "Michael Wilson", status: "Pending", amount: "$1,300", date: "08 Apr" },
];

export default function RecentTable() {
  return (
    <div className="rounded-xl border border-border border-gray-300 bg-white overflow-hidden">
                <div className="p-6 border-b border-border border-gray-300">
                  <h3 className="text-[15px] font-semibold text-gray-900 leading-none">Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border border-gray-300 bg-white">
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">Client</th>
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">Status</th>
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">Value</th>
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y  border-gray-300">
                      {RECENT_QUOTES.map((row) => (
                        <tr key={row.id} className="group transition-colors">
                          <td className="px-8 py-4 text-[13px] font-medium text-gray-900">{row.customer}</td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold ring-1 ring-inset",
                              row.status === "Approved" ? "bg-success/15 text-success ring-success/20" : 
                              row.status === "Pending" ? "bg-warning/15 text-warning ring-warning/20" : "bg-rose-500/15 text-rose-500 ring-rose-500/20"
                            )}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-[13px] font-bold text-gray-900">{row.amount}</td>
                          <td className="px-8 py-4 text-[13px] font-medium text-gray-900">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
  );
}