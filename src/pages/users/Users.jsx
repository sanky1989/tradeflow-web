import { Eye, Plus, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { UsersListSkeleton } from "../../components/users/UsersSkeleton";
import ErrorBanner from "../../components/common/ErrorBanner";
import StatusPill from "../../components/common/StatusPill";
import { getApiErrorMessage } from "../../utils/apiError";
import { getUserTypeLabel } from "./userConstants";

const ITEMS_PER_PAGE = 10;

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await userService.getAll();
      setUsers(Array.isArray(res.Data) ? res.Data : []);
    } catch (err) {
      console.error("Load users error", err);
      setError(getApiErrorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = users.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (loading) return <UsersListSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Users</h2>
          <p className="mt-1 text-sm font-medium text-gray-900">
            Manage team members, roles and access.
          </p>
        </div>
        <button
          onClick={() => navigate("/users/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          New User
        </button>
      </div>

      {error && (
        <ErrorBanner
          phase="load"
          resource="users"
          message={error}
          onRetry={loadUsers}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">User</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Email</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Type</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Roles</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Status</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300 border-b border-gray-300">
              {paginated.length > 0 ? (
                paginated.map((user) => {
                  const fullName =
                    `${user.FirstName || ""} ${user.LastName || ""}`.trim() ||
                    "Unnamed";
                  const roles = Array.isArray(user.Roles) ? user.Roles : [];
                  return (
                    <tr
                      key={user.Id}
                      className="group cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => navigate(`/users/${user.Id}`)}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                            <UserIcon size={14} />
                          </div>
                          <span className="text-[13px] font-bold text-black">
                            {fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-[13px] text-gray-900">{user.Email || "-"}</td>
                      <td className="px-8 py-4 text-[13px] text-gray-900">
                        {getUserTypeLabel(user.UserType)}
                      </td>
                      <td className="px-8 py-4">
                        {roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {roles.slice(0, 3).map((role) => (
                              <span
                                key={role}
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                              >
                                {role}
                              </span>
                            ))}
                            {roles.length > 3 && (
                              <span className="text-[11px] text-gray-500">
                                +{roles.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[13px] text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-8 py-4">
                        <StatusPill isActive={user.IsActive} />
                      </td>
                      <td className="px-8 py-4">
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionButton
                            title="View"
                            onClick={() => navigate(`/users/${user.Id}`)}
                            icon={<Eye size={16} />}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <h3 className="text-sm font-bold text-black">No users found</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Create your first user to get started.
                      </p>
                      <button
                        onClick={() => navigate("/users/new")}
                        className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                      >
                        New User
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-300 bg-white p-4 text-[11px] text-black">
          <span>
            Showing {paginated.length} of {users.length} users
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-3 py-1 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2">
              Page {users.length === 0 ? 0 : currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || users.length === 0}
              className="rounded border border-gray-300 px-3 py-1 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({ title, onClick, icon }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className="rounded-md p-2 text-gray-900 hover:bg-gray-100 hover:text-black"
  >
    {icon}
  </button>
);
