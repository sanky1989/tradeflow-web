import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

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

  // 🔹 CHANGE
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

  // 🔹 VALIDATION
  const validate = () => {
    const e = {};

    if (!form.FirstName?.trim()) e.FirstName = "First Name Required";
    if (!form.LastName?.trim()) e.LastName = "Last Name Required";

    if (!form.Email?.trim()) e.Email = "Email Required";
    else if (!/\S+@\S+\.\S+/.test(form.Email))
      e.Email = "Invalid Email";

    if (!form.Phone?.trim()) e.Phone = "Phone Required";
    if (!form.CompanyName?.trim()) e.CompanyName = "Company Required";
    if (!form.AddressLine1?.trim()) e.AddressLine1 = "Address Required";
    if (!form.AddressLine2?.trim()) e.AddressLine2 = "Address Required";
    if (!form.City?.trim()) e.City = "City Required";
    if (!form.State?.trim()) e.State = "State Required";
    if (!form.Postcode?.trim()) e.Postcode = "Postcode Required";
    if (!form.Notes?.trim()) e.Notes = "Notes Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // 🔹 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        TenantId: user?.TenantId,
        ...form,
      };

      const res = await customerService.create(payload);

      if (!res.Success) {
        toast.error(res.Message || "Create failed");
        return;
      }

      toast.success("Customer created successfully ✅");
      navigate("/customers");

    } catch (err) {
      console.error(err);
      toast.error("Create failed ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create Customer</h2>

        <button
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-6 rounded-xl border border-gray-300"
      >

        <Input label="First Name" name="FirstName" value={form.FirstName} onChange={handleChange} error={errors.FirstName} />
        <Input label="Last Name" name="LastName" value={form.LastName} onChange={handleChange} error={errors.LastName} />
        <Input label="Email" name="Email" value={form.Email} onChange={handleChange} error={errors.Email} />
        <Input label="Phone" name="Phone" value={form.Phone} onChange={handleChange} error={errors.Phone} />
        <Input label="Company" name="CompanyName" value={form.CompanyName} onChange={handleChange} error={errors.CompanyName} />
        <Input label="Address Line 1" name="AddressLine1" value={form.AddressLine1} onChange={handleChange} error={errors.AddressLine1} />
        <Input label="Address Line 2" name="AddressLine2" value={form.AddressLine2} onChange={handleChange} error={errors.AddressLine2}/>
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
        <div className="md:col-span-2 space-y-1">
          <label className="text-black text-[14px]">
            Notes <span className="text-red-500">*</span>
          </label>

          <textarea
            name="Notes"
            value={form.Notes}
            onChange={handleChange}
            className={`text-[14px] w-full rounded-lg border px-4 py-3 text-sm text-black ${
              errors.Notes ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.Notes && (
            <p className="text-xs text-red-500">{errors.Notes}</p>
          )}
        </div>

        {/* SUBMIT */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
          >
            {saving ? "Creating..." : "Create Customer"}
          </button>
        </div>

      </form>
    </div>
  );
}

// 🔹 INPUT
const Input = ({ label, name, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>

    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`text-[14px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black font-medium bg-white  focus:ring-0 focus:border-gray-300 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default CustomerCreate;