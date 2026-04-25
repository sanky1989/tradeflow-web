import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import Loader from "../../components/common/Loader";
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

function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // FETCH CUSTOMER
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await customerService.getById(id);
        if (!res.Success) throw new Error(res.Message);
        setForm(res.Data);
      } catch (err) {
        console.error(err);
        alert("Failed to load customer");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <Loader />;

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

  // VALIDATION (ALL REQUIRED)
  const validate = () => {
    const e = {};

    if (!form.FirstName?.trim()) e.FirstName = "First Name Required";
    if (!form.LastName?.trim()) e.LastName = "Last Name Required";

    if (!form.Email?.trim()) e.Email = "Email Required";
    else if (!/\S+@\S+\.\S+/.test(form.Email))
      e.Email = "Invalid Email";

    if (!form.Phone?.trim()) e.Phone = "Phone Required";
    if (!form.CompanyName?.trim()) e.CompanyName = "Company Required";

    if (!form.AddressLine1?.trim()) e.AddressLine1 = "Address Line 1 Required";
    if (!form.AddressLine2?.trim()) e.AddressLine2 = "Address Line 2 Required";

    if (!form.City?.trim()) e.City = "City Required";
    if (!form.State?.trim()) e.State = "State Required";
    if (!form.Postcode?.trim()) e.Postcode = "Postcode Required";

    if (!form.Notes?.trim()) e.Notes = "Notes Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // UPDATE CUSTOMER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        FirstName: form.FirstName || "",
        LastName: form.LastName || "",
        Email: form.Email || "",
        Phone: form.Phone || "",
        CompanyName: form.CompanyName || "",
        AddressLine1: form.AddressLine1 || "",
        AddressLine2: form.AddressLine2 || "",
        City: form.City || "",
        State: form.State || "",
        Postcode: form.Postcode || "",
        Notes: form.Notes || "",
      };

      const res = await customerService.update(id, payload);

      if (!res.Success) {
        alert(res.Message || "Update failed");
        return;
      }

      toast.success("Customer updated successfully");
      // navigate("/customers");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Customer</h2>

        <button
          onClick={() => navigate(`/customers`)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm  text-white hover:opacity-90"
        >
          Cancel
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-6 rounded-xl border border-gray-300"
      >
        <Input label="First Name" name="FirstName" value={form.FirstName} onChange={handleChange} error={errors.FirstName} />
        <Input label="Last Name" name="LastName" value={form.LastName} onChange={handleChange} error={errors.LastName} />
        <Input label="Email" name="Email" value={form.Email} onChange={handleChange} error={errors.Email} />
        <Input label="Phone" name="Phone" value={form.Phone} onChange={handleChange} error={errors.Phone} />
        <Input label="Company" name="CompanyName" value={form.CompanyName} onChange={handleChange} error={errors.CompanyName} />
        <Input label="Address Line 1" name="AddressLine1" value={form.AddressLine1} onChange={handleChange} error={errors.AddressLine1} />

        {/* ✅ FIXED */}
        <Input label="Address Line 2" name="AddressLine2" value={form.AddressLine2} onChange={handleChange} error={errors.AddressLine2} />

        <Input label="City" name="City" value={form.City} onChange={handleChange} error={errors.City} />

        {/* STATE */}
        <div className="space-y-1">
          <label className="text-black text-[14px]">State</label>
          <select
            name="State"
            value={form.State}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-sm ${
              errors.State ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select State</option>
            {STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.State && <p className="text-xs text-red-500">{errors.State}</p>}
        </div>

        <Input label="Postcode" name="Postcode" value={form.Postcode} onChange={handleChange} error={errors.Postcode} />

        {/* NOTES FIXED */}
        <div className="md:col-span-2">
          <label className="text-xs text-black">Notes</label>
          <textarea
            name="Notes"
            value={form.Notes || ""}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-sm ${
              errors.Notes ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.Notes && <p className="text-xs text-red-500">{errors.Notes}</p>}
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
              "Update"
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

export default CustomerEdit;