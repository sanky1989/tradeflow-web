import { Search, User, Eye, Pencil, Plus, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import Loader from "../../components/common/Loader";

// 🔥 CHANGE: product ke liye helpers
const getProductName = (p) => p.Name || "Unnamed Product";
const getCategory = (p) => p.Category || "-";

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  
  const formatCurrency = (value) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

  // 🔹 LOAD PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await productService.getAll();
        console.log('Product Data',res);
        setProducts(res.Data || []);
      } catch (err) {
        console.error("Load products error", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 🔹 LOCAL SEARCH (same UI)
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearching(true);

      if (!searchQuery.trim()) {
        productService.getAll().then((res) => {
          setProducts(res.Data || []);
          setSearching(false);
        });
        return;
      }

      const filtered = products.filter((p) =>
        `${p.Name} ${p.ProductCode} ${p.Category} ${p.SupplierName} ${p.ProductType}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setProducts(filtered);
      setSearching(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* HEADER SAME */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Products</h2>
          <p className="mt-1 text-sm font-medium text-gray-900">
            Manage products, pricing and inventory
          </p>
        </div>

        <button
          onClick={() => navigate("/products/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          New Product
        </button>
      </div>

      {/* SEARCH SAME */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
          <input
            type="text"
            placeholder="Search product, code, category..."
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

      {/* TABLE SAME UI */}
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Product</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">
                  Product Type
                </th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Category</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Price</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Supplier</th>
                <th className="px-8 py-4 text-[12px] font-semibold uppercase tracking-widest text-black">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300 border-b border-gray-300">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <tr key={p.Id} className="group cursor-pointer transition-colors hover:bg-gray-50">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                          <User size={14} />
                        </div>
                        <div>
                          <span className="text-[13px] font-bold text-black">
                            {getProductName(p)}
                          </span>
                          <span className="block text-[11px] text-gray-900">
                            {p.ProductCode || "-"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {p.ProductType || "-"}
                    </td>
                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {getCategory(p)}
                    </td>

                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {formatCurrency(p.SellPrice)}
                    </td>

                    <td className="px-8 py-4 text-[13px] text-gray-900">
                      {p.SupplierName || "-"}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-1">
                        <ActionButton title="View" onClick={() => navigate(`/products/${p.Id}`)} icon={<Eye size={16} />} />
                        <ActionButton title="Edit" onClick={() => navigate(`/products/${p.Id}/edit`)} icon={<Pencil size={16} />} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SAME */}
        <div className="flex items-center justify-between border-t border-gray-300 bg-white p-4 text-[11px] text-black">
          <span>Showing {paginatedProducts.length} of {products.length} products</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-3 py-1 hover:bg-accent hover:text-white disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded border border-gray-300 px-3 py-1 hover:bg-accent hover:text-white disabled:opacity-50"
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