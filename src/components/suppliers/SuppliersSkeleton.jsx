import Skeleton from "../common/Skeleton";

function HeaderSkeleton({ withButton = true }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      {withButton && <Skeleton className="h-9 w-36" />}
    </div>
  );
}

function TableSkeleton({ rows = 6, columns = 6 }) {
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
      <div className="flex items-center justify-between border-t border-gray-300 px-4 py-4">
        <Skeleton className="h-3 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SuppliersListSkeleton() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <TableSkeleton />
    </div>
  );
}

function InfoCardSkeleton({ rows = 2 }) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6">
      <Skeleton className="mb-4 h-5 w-32" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SupplierDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InfoCardSkeleton />
        <InfoCardSkeleton />
      </div>
    </div>
  );
}

export function SupplierFormSkeleton() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />

      <div className="rounded-xl border border-gray-300 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>

        <Skeleton className="mt-5 h-16 w-72" />

        <div className="mt-6 flex justify-end gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </div>
  );
}
