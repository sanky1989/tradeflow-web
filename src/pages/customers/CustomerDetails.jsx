import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, Building2, MapPin, Pencil, Plus, FileText, ArrowLeft } from "lucide-react";
import { customerService } from "../../services/customerService";
import Loader from "../../components/common/Loader";
import CustomerSites from "../../components/customers/CustomerSites";

const fullName = (customer) => `${customer?.FirstName || ""} ${customer?.LastName || ""}`.trim() || "Unnamed Customer";
const address = (customer) => [customer?.AddressLine1, customer?.AddressLine2, customer?.City, customer?.State, customer?.Postcode].filter(Boolean).join(", ");

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await customerService.getById(id);
        setCustomer(res.Data);
      } catch (err) {
        console.error(err);
        setError("Failed to load customer.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>;
  }

  if (!customer) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">Customer not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <ArrowLeft size={16} /> Back to Customers
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-black">{fullName(customer)}</h2>
          <p className="mt-1 text-sm text-gray-700">{customer.CompanyName || "No company captured"}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/customers/${id}/edit`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            onClick={() => navigate(`/customers/${id}/add-site`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            <Plus size={16} /> Add Site
          </button>
          <button
            onClick={() => navigate(`/quotes/new?customerId=${id}`)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            <FileText size={16} /> Create Quote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfoCard title="Contact Details" className="lg:col-span-1">
          <InfoRow icon={<Mail size={16} />} label="Email" value={customer.Email} />
          <InfoRow icon={<Phone size={16} />} label="Phone" value={customer.Phone} />
          <InfoRow icon={<Building2 size={16} />} label="Company" value={customer.CompanyName} />
        </InfoCard>

        <InfoCard title="Primary Address" className="lg:col-span-2">
          <InfoRow icon={<MapPin size={16} />} label="Address" value={address(customer) || "No address captured"} />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniField label="City/Suburb" value={customer.City} />
            <MiniField label="State" value={customer.State} />
            <MiniField label="Postcode" value={customer.Postcode} />
          </div>
        </InfoCard>
      </div>

      {customer.Notes && (
        <div className="rounded-xl border border-gray-300 bg-white p-6">
          <h3 className="mb-2 text-base font-semibold text-gray-900">Notes</h3>
          <p className="text-sm text-gray-700">{customer.Notes}</p>
        </div>
      )}

      <CustomerSites />
    </div>
  );
}

const InfoCard = ({ title, children, className = "" }) => (
  <div className={`rounded-xl border border-gray-300 bg-white p-6 ${className}`}>
    <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 text-gray-600">{icon}</div>
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-black">{value || "-"}</div>
    </div>
  </div>
);

const MiniField = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</div>
    <div className="mt-1 text-sm font-bold text-black">{value || "-"}</div>
  </div>
);

export default CustomerDetails;
