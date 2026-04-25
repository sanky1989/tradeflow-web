import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import Loader from "../../components/common/Loader";
import CustomerSites from "../../components/customers/CustomerSites";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH CUSTOMER
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await customerService.getById(id);
        if (!res.Success) {
          throw new Error(res.Message);
        }
        setCustomer(res.Data);
      } catch (err) {
        console.error(err);
        setError("Failed to load customer");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!customer) {
    return <div className="text-center text-red-500">Customer not found</div>;
  }

  // Address formatter
  const address = customer?.AddressLine2
    ? `${customer.AddressLine1}, ${customer.AddressLine2}`
    : customer?.AddressLine1 || "";

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-black">
          Customer Details
        </h2>

        <button
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm  text-white hover:opacity-90"
        >
          Back
        </button>
      </div>

      {/* DETAILS VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded-xl border border-gray-300 p-6">

        <Field label="First Name" value={customer?.FirstName} />
        <Field label="Last Name" value={customer?.LastName} />
        <Field label="Email" value={customer?.Email} />
        <Field label="Phone Number" value={customer?.Phone} />
        <Field label="Company" value={customer?.CompanyName} />
        <Field label="Address" value={address} />
        <Field label="City" value={customer?.City} />
        <Field label="State" value={customer?.State} />
        <Field label="Postcode" value={customer?.Postcode} />
        <Field label="Notes" value={customer?.Notes} />

      </div>
      <CustomerSites />
    </div>
  );
}

// ✅ Reusable Field Component
const Field = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">
      {label}
    </label>
    <input
      type="text"
      value={value || ""}
      readOnly
      className="text-[14px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black font-medium bg-white Focus:outline-none Focus:bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
    />
  </div>
);

export default CustomerDetails;