export default function QuoteStatus({ STATUS_DATA }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 flex flex-col">
      <h3 className="text-[15px] font-semibold text-text-main mb-10">Quote Status</h3>
      <div className="flex-1 space-y-6">
        {STATUS_DATA.map((item) => (
          <div key={item.name} className="flex flex-col gap-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-text-muted">{item.name}</span>
              <span className="text-text-main">{item.value}%</span>
            </div>
            <div className="h-2 w-full bg-bg border border-border rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}