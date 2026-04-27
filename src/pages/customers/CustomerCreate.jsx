import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import { useAuth } from "../../context/AuthContext";
import GoogleAddressAutocomplete from "../../components/customers/GoogleAddressAutocomplete";
import toast from "react-hot-toast";

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

function CustomerCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    CompanyName: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Postcode: "",
    Notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddressSelected = useCallback((address) => {
    setForm((prev) => ({
      ...prev,
      AddressLine1: address.AddressLine1 || prev.AddressLine1,
      City: address.City || prev.City,
      State: address.State || prev.State,
      Postcode: address.Postcode || prev.Postcode,
    }));

    setErrors((prev) => ({
      ...prev,
      AddressLine1: "",
      City: "",
      State: "",
      Postcode: "",
    }));
  }, []);

  const validate = () => {
    const e = {};

    if (!form.FirstName?.trim()) e.FirstName = "First name is required";
    if (!form.LastName?.trim()) e.LastName = "Last name is required";

    if (!form.Email?.trim()) e.Email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.Email)) e.Email = "Enter a valid email";

    if (!form.Phone?.trim()) e.Phone = "Phone is required";
    if (!form.CompanyName?.trim()) e.CompanyName = "Company is required";
    if (!form.AddressLine1?.trim()) e.AddressLine1 = "Address line 1 is required";
    if (!form.City?.trim()) e.City = "City/Suburb is required";
    if (!form.State?.trim()) e.State = "State is required";
    if (!form.Postcode?.trim()) e.Postcode = "Postcode is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        TenantId: user?.TenantId,
        FirstName: form.FirstName,
        LastName: form.LastName,
        Email: form.Email,
        Phone: form.Phone,
        CompanyName: form.CompanyName,
        AddressLine1: form.AddressLine1,
        AddressLine2: form.AddressLine2 || "",
        City: form.City,
        State: form.State,
        Postcode: form.Postcode,
        Notes: form.Notes || "",
      };

      const res = await customerService.create(payload);

      toast.success("Customer created successfully");
      navigate(`/customers/${res.Data?.Id || ""}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Create Customer</h2>
          <p className="mt-1 text-sm text-gray-700">Add a new customer and use Google Places to capture a clean Australian address.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-300 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="First Name" name="FirstName" value={form.FirstName} onChange={handleChange} error={errors.FirstName} />
          <Input label="Last Name" name="LastName" value={form.LastName} onChange={handleChange} error={errors.LastName} />
          <Input label="Email" name="Email" value={form.Email} onChange={handleChange} error={errors.Email} />
          <Input label="Phone" name="Phone" value={form.Phone} onChange={handleChange} error={errors.Phone} />
          <Input label="Company" name="CompanyName" value={form.CompanyName} onChange={handleChange} error={errors.CompanyName} />

          <GoogleAddressAutocomplete onAddressSelected={handleAddressSelected} />

          <Input label="Address Line 1" name="AddressLine1" value={form.AddressLine1} onChange={handleChange} error={errors.AddressLine1} />
          <Input label="Address Line 2 / Unit / Shop" name="AddressLine2" value={form.AddressLine2} onChange={handleChange} error={errors.AddressLine2} />
          <Input label="City / Suburb" name="City" value={form.City} onChange={handleChange} error={errors.City} />
          <Select label="State" name="State" value={form.State} onChange={handleChange} error={errors.State} options={AU_STATES} />
          <Input label="Postcode" name="Postcode" value={form.Postcode} onChange={handleChange} error={errors.Postcode} />

          <div className="space-y-1 md:col-span-2">
            <label className="text-black text-[14px]">Notes</label>
            <textarea
              name="Notes"
              value={form.Notes}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}

const Input = ({ label, name, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-0 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Select = ({ label, name, value, onChange, error, options }) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-0 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">Select State</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default CustomerCreate;
