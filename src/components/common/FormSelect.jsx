export default function FormSelect({
  label,
  name,
  value,
  onChange,
  error,
  options,
  placeholder = "Select an option",
}) {
  return (
    <div className="space-y-1">
      <label className="text-black text-[14px]">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className={`w-full appearance-none truncate rounded-lg border bg-white px-4 py-3 pr-10 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-0 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
