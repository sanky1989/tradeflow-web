import Skeleton from "../common/Skeleton";

function HeaderSkeleton({ withButton = true }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      {withButton && <Skeleton className="h-9 w-32" />}
    </div>
  );
}

function TableSkeleton({ rows = 6, columns = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
      <div className="border-b border-gray-300 px-8 py-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-300">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid items-center gap-4 px-8 py-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            {Array.from({ length: columns - 1 }).map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsersListSkeleton() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <TableSkeleton />
    </div>
  );
}

function SettingsSectionSkeleton({ fields = 2 }) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-gray-200 py-6 first:border-t-0 first:pt-6 md:grid-cols-3">
      <div className="space-y-2 md:col-span-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="space-y-4 md:col-span-2">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserFormSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <HeaderSkeleton />
      <div className="rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-2 sm:px-8">
        <SettingsSectionSkeleton fields={2} />
        <SettingsSectionSkeleton fields={2} />
        <SettingsSectionSkeleton fields={2} />
        <div className="mt-6 flex justify-end gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </div>
  );
}

export function UserDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Skeleton className="mb-3 h-4 w-36" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-2 sm:px-8">
        <SettingsSectionSkeleton fields={2} />
        <SettingsSectionSkeleton fields={2} />
        <SettingsSectionSkeleton fields={2} />
      </div>
    </div>
  );
}
