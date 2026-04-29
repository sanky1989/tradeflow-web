export default function SettingsSection({ title, description, children }) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-gray-200 py-6 first:border-t-0 first:pt-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <h3 className="text-base font-bold text-black">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
      <div className="md:col-span-2 space-y-4">{children}</div>
    </div>
  );
}
