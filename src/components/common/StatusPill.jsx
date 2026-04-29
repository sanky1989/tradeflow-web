export default function StatusPill({ isActive }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${
        isActive
          ? "bg-green-100 text-green-700 ring-green-200"
          : "bg-gray-100 text-gray-700 ring-gray-200"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
