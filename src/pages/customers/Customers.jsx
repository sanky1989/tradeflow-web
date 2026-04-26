import { Search, User, Eye, Pencil, Plus, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import Loader from "../../components/common/Loader";

const getFullName = (customer) => `${customer.FirstName || ""} ${customer.LastName || ""}`.trim() || "Unnamed Customer";
const getAddress = (customer) => [customer.AddressLine1, customer.City, customer.State, customer.Postcode].filter(Boolean).join(", ");

export default function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await customerService.getAll();
        setCustomers(res.Data || []);
      } catch (err) {
        console.error("Load customers error", err);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        setSearching(true);
        setError("");

        if (!searchQuery.trim()) {
          const res = await customerService.getAll();
          setCustomers(res.Data || []);
          return;
        }

        const res = await customerService.search(searchQuery);
        setCustomers(res.Data || []);
      } catch (err) {
        console.error("Search customers error", err);
        setError("Failed to search customers.");
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Customers</h2>
          <p className="mt-1 text-sm font-medium text-gray-900">Manage customers, addresses, sites and quote actions.</p>
        </div>
        <button
          onClick={() => navigate("/customers/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          New Customer
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
          <input
            type="text"
            placeholder="Search customer, company, email, phone or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
          />
        </div>
        {searching && <span className="text-xs text-gray-500">Searching...</span>}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Client</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Company & Address</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Phone</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Note</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300 border-b border-gray-300">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.Id}
                    className="group cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => navigate(`/customers/${customer.Id}`)}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                          <User size={14} />
                        </div>
                        <div>
                          <span className="text-[13px] font-bold text-black">{getFullName(customer)}</span>
                          <span className="block text-[11px] text-gray-900">{customer.Email || "-"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-4">
                      <div>
                        <span className="text-[13px] font-medium text-black">{customer.CompanyName || "-"}</span>
                        <span className="block max-w-[420px] truncate text-[12px] text-gray-900">{getAddress(customer) || "No address captured"}</span>
                      </div>
                    </td>

                    <td className="px-8 py-4 text-[13px] text-gray-900">{customer.Phone || "-"}</td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      <span className="block max-w-[260px] truncate">{customer.Notes || "-"}</span>
                    </td>

                    <td className="px-8 py-4">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <ActionButton title="View" onClick={() => navigate(`/customers/${customer.Id}`)} icon={<Eye size={16} />} />
                        <ActionButton title="Edit" onClick={() => navigate(`/customers/${customer.Id}/edit`)} icon={<Pencil size={16} />} />
                        <ActionButton title="Add Site" onClick={() => navigate(`/customers/${customer.Id}/add-site`)} icon={<Plus size={16} />} />
                        <ActionButton title="Create Quote" onClick={() => navigate(`/quotes/new?customerId=${customer.Id}`)} icon={<FileText size={16} />} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <h3 className="text-sm font-bold text-black">No customers found</h3>
                      <p className="mt-1 text-sm text-gray-600">Create your first customer or change the search term.</p>
                      <button
                        onClick={() => navigate("/customers/new")}
                        className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                      >
                        New Customer
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-300 bg-white p-4 text-[11px] text-black">
          <span>Showing {paginatedCustomers.length} of {customers.length} customers</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-3 py-1 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2">Page {totalPages === 0 ? 0 : currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
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
