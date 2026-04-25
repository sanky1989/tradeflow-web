import { Search, Filter, User } from "lucide-react";
import { useState, useEffect } from "react";
import { customerService } from "../../services/customerService";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus  } from "lucide-react";

export default function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [CUSTOMER_DATA, setCUSTOMER_DATA] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔥 LOAD ALL CUSTOMERS (initial)
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const res = await customerService.getAll();
        setCUSTOMER_DATA(res.Data);
      } catch (err) {
        console.log("Load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  // 🔥 SEARCH API (Debounce)
  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        // ❗ empty search -> load all
        if (!searchQuery.trim()) {
          const res = await customerService.getAll();
          setCUSTOMER_DATA(res.Data);
          return;
        }

        const res = await customerService.search(searchQuery);

        if (!res.Success) return;

        setCUSTOMER_DATA(res.Data);
      } catch (err) {
        console.log("Search error", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  // ✅ Reset page on search/filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // ✅ Filter (only status now, search API handle karega)
  const filteredCustomers = CUSTOMER_DATA.filter((customer) => {
    const matchesStatus =
      statusFilter === "All" || customer.Status === statusFilter;

    return matchesStatus;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginatedCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 sm:space-y78">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Customers</h2>
          <p className="text-sm font-medium text-gray-900 mt-1">
            Manage and track your client details
          </p>
        </div>
        <button
          onClick={() => navigate("/customers/new")}
          className="justify-center inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          New Customer
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-md:max-w-none w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black placeholder:text-black  transition-all"
          />
        </div>

        {/* <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5">
            <Filter size={14} className="text-black" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-black outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div> */}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-300 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Client</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Company & Location</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Phone</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Note</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300 border-b border-gray-300">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <tr key={customer.Id} className="group transition-colors cursor-pointer">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-accent">
                          <User size={14} />
                        </div>
                        <div>
                          <span className="text-[13px] font-bold text-black">
                            {customer.FirstName} {customer.LastName}
                          </span>
                          <span className="text-[11px] text-gray-900 block">
                            {customer.Email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-4">
                      <div>
                        <span className="text-[13px] font-medium text-black">
                          {customer.CompanyName}
                        </span>
                        <span className="text-[12px] text-gray-900 block">
                          {customer?.City}, {customer?.State}, {customer?.Postcode}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {customer.Phone}
                    </td>

                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {customer?.Notes}
                    </td>

                    <td className="px-8 py-4 flex gap-0">
                      <button
                        onClick={() => navigate(`/customers/${customer.Id}/edit`)}
                        className="text-[8px] px-3 py-1 rounded"
                      >
                        <Pencil size={16} className="text-gray-900" />
                      </button>
                      <button
                        onClick={() => navigate(`/customers/${customer.Id}`)}
                        className="text-[11px] px-3 py-1 rounded "
                      >
                        <Eye size={16} className="text-gray-900" />
                      </button>
                      <button
                        onClick={() => navigate(`/customers/${customer.Id}/add-site`)}
                        className="text-[11px] px-3 py-1 rounded "
                      >
                        <Plus size={16} className="text-gray-900" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-900 text-[14px]">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between text-[11px] text-black">
          <span>
            Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-accent hover:text-white disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-accent hover:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}