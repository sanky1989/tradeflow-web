export default function CheckboxGroup({ label, options, value = [], onChange, error }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-black text-[14px]">{label}</label>
      <div
        className={`grid grid-cols-1 gap-2 rounded-lg border bg-white p-3 sm:grid-cols-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {options.length === 0 && (
          <p className="text-xs text-gray-500">No options available.</p>
        )}
        {options.map((o) => {
          const checked = value.includes(o.value);
          return (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(o.value)}
                className="h-4 w-4 cursor-pointer accent-accent"
              />
              <span className="text-sm text-black">{o.label}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
