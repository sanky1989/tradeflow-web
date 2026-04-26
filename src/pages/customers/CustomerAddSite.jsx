import { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import GoogleAddressAutocomplete from "../../components/customers/GoogleAddressAutocomplete";
import toast from "react-hot-toast";

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

function CustomerAddSite() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    SiteName: "",
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
      SiteName: prev.SiteName || address.FormattedAddress || address.AddressLine1,
      AddressLine1: address.AddressLine1 || prev.AddressLine1,
      City: address.City || prev.City,
      State: address.State || prev.State,
      Postcode: address.Postcode || prev.Postcode,
    }));

    setErrors((prev) => ({
      ...prev,
      SiteName: "",
      AddressLine1: "",
      City: "",
      State: "",
      Postcode: "",
    }));
  }, []);

  const validate = () => {
    const e = {};

    if (!form.SiteName?.trim()) e.SiteName = "Site name is required";
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
        SiteName: form.SiteName,
        AddressLine1: form.AddressLine1,
        AddressLine2: form.AddressLine2 || "",
        City: form.City,
        State: form.State,
        Postcode: form.Postcode,
        Notes: form.Notes || "",
      };

      await customerService.addSite(id, payload);
      toast.success("Site added successfully");
      navigate(`/customers/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add site");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Add Customer Site</h2>
          <p className="mt-1 text-sm text-gray-700">Add an installation or service address for this customer.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/customers/${id}`)}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-300 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="Site Name" name="SiteName" value={form.SiteName} onChange={handleChange} error={errors.SiteName} />

          <GoogleAddressAutocomplete label="Search Site Address" onAddressSelected={handleAddressSelected} />

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
            onClick={() => navigate(`/customers/${id}`)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add Site"}
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

export default CustomerAddSite;
