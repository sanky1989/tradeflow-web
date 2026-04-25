import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import toast from "react-hot-toast";

// ✅ STATES ARRAY
const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
  "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
  "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana",
  "Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York",
  "North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
  "Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming"
];

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

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // VALIDATION
  const validate = () => {
    const e = {};

    if (!form.SiteName?.trim()) e.SiteName = "Site Name Required";
    if (!form.AddressLine1?.trim()) e.AddressLine1 = "Address Line 1 Required";
    if (!form.AddressLine2?.trim()) e.AddressLine2 = "Address Line 2 Required";
    if (!form.City?.trim()) e.City = "City Required";
    if (!form.State?.trim()) e.State = "State Required";
    if (!form.Postcode?.trim()) e.Postcode = "Postcode Required";
    if (!form.Notes?.trim()) e.Notes = "Notes Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        SiteName: form.SiteName || "",
        AddressLine1: form.AddressLine1 || "",
        AddressLine2: form.AddressLine2 || "",
        City: form.City || "",
        State: form.State || "",
        Postcode: form.Postcode || "",
        Notes: form.Notes || "",
      };

      const res = await customerService.addSite(id, payload);

      if (!res.Success) {
        toast.error(res.Message || "Failed");
        return;
      }

      toast.success("Site added successfully ✅");
      navigate(`/customers`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add site ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Add Customer Site</h2>

        <button
          onClick={() => navigate(`/customers`)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          Cancel
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-6 rounded-xl border border-gray-300"
      >
        <Input label="Site Name" name="SiteName" value={form.SiteName} onChange={handleChange} error={errors.SiteName} />

        <Input label="Address Line 1" name="AddressLine1" value={form.AddressLine1} onChange={handleChange} error={errors.AddressLine1} />

        <Input label="Address Line 2" name="AddressLine2" value={form.AddressLine2} onChange={handleChange} error={errors.AddressLine2} />

        <Input label="City" name="City" value={form.City} onChange={handleChange} error={errors.City} />

        {/* ✅ STATE DROPDOWN */}
        <div className="space-y-1">
          <label className="text-black text-[14px]">State</label>

          <select
            name="State"
            value={form.State}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-sm text-black ${
              errors.State ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select State</option>
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {errors.State && (
            <p className="text-xs text-red-500">{errors.State}</p>
          )}
        </div>

        <Input label="Postcode" name="Postcode" value={form.Postcode} onChange={handleChange} error={errors.Postcode} />

        {/* NOTES */}
        <div className="md:col-span-2">
          <label className="text-sm text-black">Notes</label>
          <textarea
            name="Notes"
            value={form.Notes}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-sm text-black ${
              errors.Notes ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.Notes && (
            <p className="text-xs text-red-500">{errors.Notes}</p>
          )}
        </div>

        {/* SUBMIT */}
        <div className="md:col-span-2 flex justify-start">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Add Site"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// INPUT COMPONENT
const Input = ({ label, name, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>

    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-black ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default CustomerAddSite;