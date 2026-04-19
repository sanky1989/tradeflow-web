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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-8 border-b border-border">
                  <h3 className="text-[15px] font-semibold text-text-main leading-none">Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-sidebar/50">
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Client</th>
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Value</th>
                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {RECENT_QUOTES.map((row) => (
                        <tr key={row.id} className="group transition-colors hover:bg-bg/50">
                          <td className="px-8 py-4 text-[13px] font-medium text-text-main">{row.customer}</td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "inline-flex items-center rounded px-2 py-1 text-[11px] font-bold ring-1 ring-inset",
                              row.status === "Approved" ? "bg-success/15 text-success ring-success/20" : 
                              row.status === "Pending" ? "bg-warning/15 text-warning ring-warning/20" : "bg-rose-500/15 text-rose-500 ring-rose-500/20"
                            )}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-[13px] font-bold text-text-main">{row.amount}</td>
                          <td className="px-8 py-4 text-[13px] font-medium text-text-muted">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
  );
}