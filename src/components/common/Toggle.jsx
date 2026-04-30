import { Check } from "lucide-react";

export default function Toggle({ checked, onChange, disabled = false, label, description }) {
  return (
    <label
      className={`flex items-start gap-4 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          checked
            ? "bg-green-500 focus:ring-green-500"
            : "bg-gray-300 focus:ring-gray-400"
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        >
          {checked && <Check size={12} className="text-green-500" strokeWidth={3} />}
        </span>
      </button>

      {(label || description) && (
        <div>
          {label && (
            <p className="text-sm font-bold text-black">{label}</p>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-gray-600">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}
