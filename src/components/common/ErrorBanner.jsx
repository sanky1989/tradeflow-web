import { AlertCircle, RefreshCw } from "lucide-react";

const PHASE_PREFIX = {
  load: "Couldn't load",
  refresh: "Couldn't refresh",
  save: "Couldn't save",
  submit: "Couldn't submit",
};

const buildTitle = ({ title, phase, resource }) => {
  if (title) return title;
  const prefix = PHASE_PREFIX[phase] || "Something went wrong";
  return resource ? `${prefix} ${resource}` : prefix;
};

export default function ErrorBanner({
  title,
  message,
  phase = "load",
  resource,
  onRetry,
  retryLabel = "Retry",
}) {
  const computedTitle = buildTitle({ title, phase, resource });

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-red-600"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-bold text-red-800">{computedTitle}</p>
          {message && (
            <p className="mt-1 text-sm text-red-700">{message}</p>
          )}
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:self-auto"
        >
          <RefreshCw size={14} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
