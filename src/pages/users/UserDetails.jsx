import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ErrorBanner from "../../components/common/ErrorBanner";
import SettingsSection from "../../components/common/SettingsSection";
import StatusPill from "../../components/common/StatusPill";
import { UserDetailsSkeleton } from "../../components/users/UsersSkeleton";
import { userService } from "../../services/userService";
import { getApiErrorMessage } from "../../utils/apiError";
import { getUserTypeLabel } from "./userConstants";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await userService.getById(id);
      setUser(res.Data);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Failed to load user."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser();
  }, [loadUser]);

  if (loading) return <UserDetailsSkeleton />;

  if (error) {
    return (
      <ErrorBanner
        phase="load"
        resource="user"
        message={error}
        onRetry={loadUser}
      />
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        User not found.
      </div>
    );
  }

  const fullName =
    `${user.FirstName || ""} ${user.LastName || ""}`.trim() || "Unnamed User";
  const roles = Array.isArray(user.Roles) ? user.Roles : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeft size={16} /> Back to Users
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-black">
                {fullName}
              </h2>
              <StatusPill isActive={user.IsActive} />
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {user.Email || "No email captured"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-2 shadow-sm sm:px-8">
        <SettingsSection
          title="User Profile"
          description="Basic details that identify this user."
        >
          <ReadOnlyField label="First Name" value={user.FirstName} />
          <ReadOnlyField label="Last Name" value={user.LastName} />
        </SettingsSection>

        <SettingsSection
          title="Contact"
          description="How you'll reach this user."
        >
          <ReadOnlyField label="Email" value={user.Email} />
          <ReadOnlyField label="Phone" value={user.Phone} />
        </SettingsSection>

        <SettingsSection
          title="Access"
          description="What this user can do in the system."
        >
          <ReadOnlyField
            label="User Type"
            value={getUserTypeLabel(user.UserType)}
          />
          <div className="space-y-1">
            <p className="text-[14px] text-black">Roles</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              {roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-800 ring-1 ring-gray-200"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">No roles assigned</span>
              )}
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

const ReadOnlyField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[14px] text-black">{label}</p>
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black">
      {value || <span className="text-gray-400">—</span>}
    </div>
  </div>
);
