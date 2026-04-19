export default function RevenueProjection() {
  return (
    <div className="lg:col-span-2 rounded-xl border border-border bg-card p-8">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-[15px] font-semibold text-text-main leading-none">Revenue Projection</h3>
          <p className="mt-2 text-xs font-medium text-text-muted">Projected vs actual monthly performance</p>
        </div>
        <div className="text-xs font-medium text-text-muted bg-bg border border-border rounded-lg px-3 py-1.5">
          Last 6 Months
        </div>
      </div>
    </div>
  );
}