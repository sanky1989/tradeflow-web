import { Search, Filter, User } from "lucide-react";
import { useState, useEffect } from "react";
import { customerService } from "../../services/customerService";
import Loader from "../../components/common/Loader";
import { useNavigate, useParams } from "react-router-dom";

export default function CustomerSites() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [SITE_DATA, setSITE_DATA] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔥 LOAD SITES
  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const res = await customerService.getSites(id);
        setSITE_DATA(res.Data);
      } catch (err) {
        console.log("Sites error", err);
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, [id]);

  // 🔍 SEARCH (LOCAL FILTER - UI SAME)
  const filteredSites = SITE_DATA.filter((site) => {
    return (
      site.SiteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.City?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.State?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginatedSites = filteredSites.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Customer Sites</h2>

        <button
          onClick={() => navigate(`/customers/${id}/add-site`)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm  text-white hover:opacity-90"
        >
          Add Site
        </button>
      </div>

      {/* SEARCH (SAME UI) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black"
          />
        </div>
      </div>

      {/* TABLE (SAME DESIGN) */}
      <div className="rounded-xl border border-gray-300 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Site Name</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Address</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">City</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">State</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Post code</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300 border-b border-gray-300">
              {paginatedSites.length > 0 ? (
                paginatedSites.map((site) => (
                  <tr key={site.Id} className="group">

                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] text-black">
                          {site.SiteName}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {site?.AddressLine1},<br></br>
                      {site?.AddressLine2}
                    </td>

                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {site.City}
                    </td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {site.State}
                    </td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {site.Postcode}
                    </td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {site.Notes}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-900 text-[14px]">
                    No sites found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* PAGINATION SAME */}
        <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between text-[11px] text-black">
          <span>
            Showing {paginatedSites.length} of {filteredSites.length} sites
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}