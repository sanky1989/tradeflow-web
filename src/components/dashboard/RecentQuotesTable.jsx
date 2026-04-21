import { cn } from "../../lib/utils";

export default function RecentQuotesTable({ RECENT_QUOTES }) {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="p-8 border-b border-border">
        <h3 className="text-[15px] font-semibold text-text-main">Recent Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-white">
              <th className="px-8 py-4 text-[11px] font-bold text-text-muted">Client</th>
              <th className="px-8 py-4 text-[11px] font-bold text-text-muted">Status</th>
              <th className="px-8 py-4 text-[11px] font-bold text-text-muted">Value</th>
              <th className="px-8 py-4 text-[11px] font-bold text-text-muted">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {RECENT_QUOTES.map((row) => (
              <tr key={row.id}>
                <td className="px-8 py-4">{row.customer}</td>
                <td className="px-8 py-4">
                  <span className={cn("px-2 py-1 text-[11px] font-bold",
                    row.status === "Approved" ? "text-success" :
                    row.status === "Pending" ? "text-warning" : "text-rose-500"
                  )}>
                    {row.status}
                  </span>
                </td>
                <td className="px-8 py-4">{row.amount}</td>
                <td className="px-8 py-4">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}