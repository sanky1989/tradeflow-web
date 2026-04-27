import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ErrorBanner from "../../components/common/ErrorBanner";
import FormInput from "../../components/common/FormInput";
import { supplierService } from "../../services/supplierService";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { validateSupplierForm } from "./validation";

export default function SupplierCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    Name: "",
    ContactName: "",
    Email: "",
    Phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      const payload = {
        TenantId: user?.TenantId,
        Name: form.Name,
        ContactName: form.ContactName,
        Email: form.Email,
        Phone: form.Phone,
      };
      const res = await supplierService.create(payload);
      toast.success("Supplier created successfully");
      navigate(`/suppliers/${res.Data?.Id || ""}`);
    } catch (err) {
      console.error(err);
      const message = getApiErrorMessage(err, "Failed to create supplier.");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Create Supplier</h2>
          <p className="mt-1 text-sm text-gray-700">Add a new supplier and their primary contact details.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/suppliers")}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {submitError && (
        <ErrorBanner
          phase="save"
          resource="supplier"
          message={submitError}
        />
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-300 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormInput label="Supplier Name" name="Name" value={form.Name} onChange={handleChange} error={errors.Name} />
          <FormInput label="Contact Name" name="ContactName" value={form.ContactName} onChange={handleChange} error={errors.ContactName} />
          <FormInput label="Email" name="Email" value={form.Email} onChange={handleChange} error={errors.Email} />
          <FormInput label="Phone" name="Phone" value={form.Phone} onChange={handleChange} error={errors.Phone} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/suppliers")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
}

