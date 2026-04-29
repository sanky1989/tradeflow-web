import { Truck, Eye, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supplierService } from "../../services/supplierService";
import { SuppliersListSkeleton } from "../../components/suppliers/SuppliersSkeleton";
import ErrorBanner from "../../components/common/ErrorBanner";
import StatusPill from "../../components/common/StatusPill";
import { getApiErrorMessage } from "../../utils/apiError";

const ITEMS_PER_PAGE = 10;

export default function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await supplierService.getAll();
      setSuppliers(Array.isArray(res.Data) ? res.Data : []);
    } catch (err) {
      console.error("Load suppliers error", err);
      setError(getApiErrorMessage(err, "Failed to load suppliers."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSuppliers();
  }, []);

  const totalPages = Math.max(1, Math.ceil(suppliers.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = suppliers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (loading) return <SuppliersListSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Suppliers</h2>
          <p className="mt-1 text-sm font-medium text-gray-900">
            Manage suppliers, contacts and active status.
          </p>
        </div>
        <button
          onClick={() => navigate("/suppliers/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          New Supplier
        </button>
      </div>

      {error && (
        <ErrorBanner
          phase="load"
          resource="suppliers"
          message={error}
          onRetry={loadSuppliers}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Supplier</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Contact</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Email</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Phone</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Status</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300 border-b border-gray-300">
              {paginated.length > 0 ? (
                paginated.map((supplier) => (
                  <tr
                    key={supplier.Id}
                    className="group cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => navigate(`/suppliers/${supplier.Id}`)}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                          <Truck size={14} />
                        </div>
                        <span className="text-[13px] font-bold text-black">{supplier.Name || "Unnamed"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">{supplier.ContactName || "-"}</td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">{supplier.Email || "-"}</td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">{supplier.Phone || "-"}</td>
                    <td className="px-8 py-4">
                      <StatusPill isActive={supplier.IsActive} />
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <ActionButton
                          title="View"
                          onClick={() => navigate(`/suppliers/${supplier.Id}`)}
                          icon={<Eye size={16} />}
                        />
                        <ActionButton
                          title="Edit"
                          onClick={() => navigate(`/suppliers/${supplier.Id}/edit`)}
                          icon={<Pencil size={16} />}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <h3 className="text-sm font-bold text-black">No suppliers found</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Create your first supplier to get started.
                      </p>
                      <button
                        onClick={() => navigate("/suppliers/new")}
                        className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                      >
                        New Supplier
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-300 bg-white p-4 text-[11px] text-black">
          <span>
            Showing {paginated.length} of {suppliers.length} suppliers
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-3 py-1 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2">
              Page {suppliers.length === 0 ? 0 : currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || suppliers.length === 0}
              className="rounded border border-gray-300 px-3 py-1 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({ title, onClick, icon }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className="rounded-md p-2 text-gray-900 hover:bg-gray-100 hover:text-black"
  >
    {icon}
  </button>
);
