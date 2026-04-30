import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CheckboxGroup from "../../components/common/CheckboxGroup";
import ErrorBanner from "../../components/common/ErrorBanner";
import FormInput from "../../components/common/FormInput";
import FormSelect from "../../components/common/FormSelect";
import SettingsSection from "../../components/common/SettingsSection";
import { UserFormSkeleton } from "../../components/users/UsersSkeleton";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { USER_TYPE_OPTIONS } from "./userConstants";
import { validateUserForm } from "./validation";

const INITIAL_FORM = {
  FirstName: "",
  LastName: "",
  Email: "",
  Phone: "",
  Password: "",
  UserType: "",
  RoleIds: [],
};

export default function UserCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [rolesError, setRolesError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const loadRoles = useCallback(async () => {
    try {
      setLoadingRoles(true);
      setRolesError("");
      const res = await userService.getRoles();
      setRoles(Array.isArray(res.Data) ? res.Data : []);
    } catch (err) {
      console.error(err);
      setRolesError(getApiErrorMessage(err, "Failed to load roles."));
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRoles();
  }, [loadRoles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRolesChange = (next) => {
    setForm((prev) => ({ ...prev, RoleIds: next }));
    setErrors((prev) => ({ ...prev, RoleIds: "" }));
  };

  const validate = () => {
    const e = validateUserForm(form);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitError("");
    try {
      const payload = {
        TenantId: user?.TenantId,
        FirstName: form.FirstName,
        LastName: form.LastName,
        Email: form.Email,
        Phone: form.Phone,
        Password: form.Password,
        UserType: Number(form.UserType),
        RoleIds: form.RoleIds,
      };
      const res = await userService.create(payload);
      toast.success("User created successfully");
      navigate(`/users/${res.Data?.Id || ""}`);
    } catch (err) {
      console.error(err);
      const message = getApiErrorMessage(err, "Failed to create user.");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingRoles) return <UserFormSkeleton />;

  const roleOptions = roles.map((r) => ({ value: r.Id, label: r.Name }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Create User</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add a new team member with roles and access type.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="inline-flex w-fit items-center justify-center self-start rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50 sm:self-auto"
        >
          Cancel
        </button>
      </div>

      {rolesError && (
        <ErrorBanner
          phase="load"
          resource="roles"
          message={rolesError}
          onRetry={loadRoles}
        />
      )}

      {submitError && (
        <ErrorBanner phase="save" resource="user" message={submitError} />
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-2 shadow-sm sm:px-8"
      >
        <SettingsSection
          title="User Profile"
          description="Basic details that identify this user."
        >
          <FormInput
            label="First Name"
            name="FirstName"
            value={form.FirstName}
            onChange={handleChange}
            error={errors.FirstName}
          />
          <FormInput
            label="Last Name"
            name="LastName"
            value={form.LastName}
            onChange={handleChange}
            error={errors.LastName}
          />
        </SettingsSection>

        <SettingsSection
          title="Contact & Sign-in"
          description="Email, phone and the temporary password for first sign-in."
        >
          <FormInput
            label="Email"
            name="Email"
            value={form.Email}
            onChange={handleChange}
            error={errors.Email}
          />
          <FormInput
            label="Phone"
            name="Phone"
            value={form.Phone}
            onChange={handleChange}
            error={errors.Phone}
          />
          <FormInput
            label="Password"
            name="Password"
            type="password"
            value={form.Password}
            onChange={handleChange}
            error={errors.Password}
          />
        </SettingsSection>

        <SettingsSection
          title="Access"
          description="What this user can do in the system."
        >
          <FormSelect
            label="User Type"
            name="UserType"
            value={form.UserType}
            onChange={handleChange}
            error={errors.UserType}
            options={USER_TYPE_OPTIONS}
            placeholder="Select a user type"
          />
          <CheckboxGroup
            label="Roles"
            options={roleOptions}
            value={form.RoleIds}
            onChange={handleRolesChange}
            error={errors.RoleIds}
          />
        </SettingsSection>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
