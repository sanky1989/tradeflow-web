import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { SupplierDetailsSkeleton } from "../../components/suppliers/SuppliersSkeleton";
import ErrorBanner from "../../components/common/ErrorBanner";
import SettingsSection from "../../components/common/SettingsSection";
import Toggle from "../../components/common/Toggle";
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/suppliers")}
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeft size={16} /> Back to Suppliers
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">
              {supplier.Name || "Unnamed Supplier"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {supplier.ContactName
                ? `Primary contact: ${supplier.ContactName}`
                : "No primary contact captured"}
            </p>
          </div>
          <button
            onClick={() => navigate(`/suppliers/${id}/edit`)}
            className="inline-flex w-fit items-center gap-2 self-start rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90 sm:self-auto"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-2 shadow-sm sm:px-8">
        <SettingsSection
          title="Supplier Profile"
          description="Basic details that identify this supplier."
        >
          <ReadOnlyField label="Supplier Name" value={supplier.Name} />
          <ReadOnlyField label="Contact Name" value={supplier.ContactName} />
        </SettingsSection>

        <SettingsSection
          title="Contact Details"
          description="How you'll reach this supplier."
        >
          <ReadOnlyField label="Email" value={supplier.Email} />
          <ReadOnlyField label="Phone" value={supplier.Phone} />
        </SettingsSection>

        <SettingsSection
          title="Status"
          description="Inactive suppliers won't appear in selection lists."
        >
          <Toggle
            checked={!!supplier.IsActive}
            disabled
            label={supplier.IsActive ? "Active" : "Inactive"}
            description={
              supplier.IsActive
                ? "This supplier is available for use."
                : "This supplier is hidden from selection lists."
            }
          />
        </SettingsSection>
      </div>
    </div>
  );
}

const ReadOnlyField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[14px] text-black">{label}</p>
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black">
      {value || <span className="text-gray-400">—</span>}
    </div>
  </div>
);
