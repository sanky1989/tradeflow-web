import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Pencil, Phone, Truck, User } from "lucide-react";
import { SupplierDetailsSkeleton } from "../../components/suppliers/SuppliersSkeleton";
import ErrorBanner from "../../components/common/ErrorBanner";
import StatusPill from "../../components/common/StatusPill";
import { supplierService } from "../../services/supplierService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function SupplierDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSupplier = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await supplierService.getById(id);
      setSupplier(res.Data);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Failed to load supplier."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSupplier();
  }, [loadSupplier]);

  if (loading) return <SupplierDetailsSkeleton />;

  if (error) {
    return (
      <ErrorBanner
        phase="load"
        resource="supplier"
        message={error}
        onRetry={loadSupplier}
      />
    );
  }

  if (!supplier) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        Supplier not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/suppliers")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <ArrowLeft size={16} /> Back to Suppliers
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-black">
              {supplier.Name || "Unnamed Supplier"}
            </h2>
            <StatusPill isActive={supplier.IsActive} />
          </div>
          <p className="mt-1 text-sm text-gray-700">
            {supplier.ContactName ? `Primary contact: ${supplier.ContactName}` : "No primary contact captured"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/suppliers/${id}/edit`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            <Pencil size={16} /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InfoCard title="Supplier">
          <InfoRow icon={<Truck size={16} />} label="Name" value={supplier.Name} />
          <InfoRow icon={<User size={16} />} label="Contact" value={supplier.ContactName} />
        </InfoCard>

        <InfoCard title="Contact Details">
          <InfoRow icon={<Mail size={16} />} label="Email" value={supplier.Email} />
          <InfoRow icon={<Phone size={16} />} label="Phone" value={supplier.Phone} />
        </InfoCard>
      </div>
    </div>
  );
}

const InfoCard = ({ title, children }) => (
  <div className="rounded-xl border border-gray-300 bg-white p-6">
    <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 text-gray-600">{icon}</div>
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-black">{value || "-"}</div>
    </div>
  </div>
);
