import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { SupplierFormSkeleton } from "../../components/suppliers/SuppliersSkeleton";
import ErrorBanner from "../../components/common/ErrorBanner";
import FormInput from "../../components/common/FormInput";
import SettingsSection from "../../components/common/SettingsSection";
import Toggle from "../../components/common/Toggle";
import { supplierService } from "../../services/supplierService";
import { getApiErrorMessage } from "../../utils/apiError";
import { validateSupplierForm } from "./validation";

export default function SupplierEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  const loadSupplier = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const res = await supplierService.getById(id);
      const s = res.Data || {};
      setForm({
        Name: s.Name || "",
        ContactName: s.ContactName || "",
        Email: s.Email || "",
        Phone: s.Phone || "",
        IsActive: s.IsActive ?? true,
      });
    } catch (err) {
      console.error(err);
      setLoadError(getApiErrorMessage(err, "Failed to load supplier."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSupplier();
  }, [loadSupplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggleActive = (next) => {
    setForm((prev) => ({ ...prev, IsActive: next }));
  };

  const validate = () => {
    const e = validateSupplierForm(form);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitError("");
    try {
      await supplierService.update(id, {
        Name: form.Name,
        ContactName: form.ContactName,
        Email: form.Email,
        Phone: form.Phone,
        IsActive: form.IsActive,
      });
      toast.success("Supplier updated");
      navigate(`/suppliers/${id}`);
    } catch (err) {
      console.error(err);
      const message = getApiErrorMessage(err, "Failed to update supplier.");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SupplierFormSkeleton />;

  if (loadError) {
    return (
      <ErrorBanner
        phase="load"
        resource="supplier"
        message={loadError}
        onRetry={loadSupplier}
      />
    );
  }

  if (!form) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Edit Supplier</h2>
          <p className="mt-1 text-sm text-gray-600">
            Update supplier contact details and active status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/suppliers/${id}`)}
          className="inline-flex w-fit items-center justify-center self-start rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50 sm:self-auto"
        >
          Cancel
        </button>
      </div>

      {submitError && (
        <ErrorBanner phase="save" resource="supplier" message={submitError} />
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-2 shadow-sm sm:px-8"
      >
        <SettingsSection
          title="Supplier Profile"
          description="Basic details that identify this supplier."
        >
          <FormInput
            label="Supplier Name"
            name="Name"
            value={form.Name}
            onChange={handleChange}
            error={errors.Name}
          />
          <FormInput
            label="Contact Name"
            name="ContactName"
            value={form.ContactName}
            onChange={handleChange}
            error={errors.ContactName}
          />
        </SettingsSection>

        <SettingsSection
          title="Contact Details"
          description="How you'll reach this supplier."
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
        </SettingsSection>

        <SettingsSection
          title="Status"
          description="Inactive suppliers won't appear in selection lists."
        >
          <Toggle
            checked={form.IsActive}
            onChange={handleToggleActive}
            label={form.IsActive ? "Active" : "Inactive"}
            description={
              form.IsActive
                ? "This supplier is available for use."
                : "This supplier is hidden from selection lists."
            }
          />
        </SettingsSection>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/suppliers/${id}`)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
