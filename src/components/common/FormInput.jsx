export default function FormInput({ label, name, value, onChange, error, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-black text-[14px]">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`w-full rounded-lg border px-4 py-3 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-0 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
