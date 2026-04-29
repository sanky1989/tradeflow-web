// UserType enum mapping.
//
// IMPORTANT: The API is inconsistent here:
//   - GET /api/users returns UserType as a STRING (e.g. "TenantSuperAdmin")
//   - POST /api/users requires UserType as an INTEGER (1-7)
//
// The swagger does not document which integer maps to which name.
// The mapping below is a GUESS based on a typical seniority ordering.
// TODO: Confirm with backend team and correct if wrong.
//
// Confirmed strings (seen in API responses):
//   - PlatformSuperAdmin
//   - TenantSuperAdmin
//   - ExternalInstaller
// Other entries are guesses.
export const USER_TYPE_OPTIONS = [
  { value: 1, key: "PlatformSuperAdmin", label: "Platform Super Admin" },
  { value: 2, key: "TenantSuperAdmin", label: "Tenant Super Admin" },
  { value: 3, key: "TenantAdmin", label: "Tenant Admin" },
  { value: 4, key: "Operations", label: "Operations" },
  { value: 5, key: "Sales", label: "Sales" },
  { value: 6, key: "Installer", label: "Installer" },
  { value: 7, key: "ExternalInstaller", label: "External Installer" },
];

const KEY_TO_LABEL = Object.fromEntries(
  USER_TYPE_OPTIONS.map((o) => [o.key, o.label])
);

const VALUE_TO_LABEL = Object.fromEntries(
  USER_TYPE_OPTIONS.map((o) => [o.value, o.label])
);

const humanize = (key = "") =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

// Accepts either the string key (read responses) or the integer value (write payloads)
// and returns a friendly label.
export const getUserTypeLabel = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return VALUE_TO_LABEL[value] || `Type ${value}`;
  return KEY_TO_LABEL[value] || humanize(String(value));
};
