import { Search, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import Loader from "../../components/common/Loader";

export default function Products() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 NEW: dynamic page size
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await productService.getAll();
        setProducts(res?.Data ?? res?.data ?? []);
      } catch (err) {
        console.error("Load products error", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 🔥 reset page when search OR page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();

    return products.filter((p) =>
      `${p.Name ?? p.name ?? ""} ${p.ProductCode ?? p.productCode ?? ""} ${
        p.Category ?? p.category ?? ""
      } ${p.SupplierName ?? p.supplierName ?? ""} ${
        p.ProductType ?? p.productType ?? ""
      }`
        .toLowerCase()
        .includes(query)
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Products
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-900">
            Manage product master data, pricing and setup
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/products/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          <Plus size={16} />
          New Product
        </button>
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border border-gray-300 bg-white p-4">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
            size={16}
          />
          <input
            type="text"
            placeholder="Search product, code, category, supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black placeholder:text-gray-500 focus:border-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-8 py-4 text-xs font-semibold uppercase tracking-widest">
                  Product
                </th>
                <th className="px-8 py-4 text-xs font-semibold uppercase tracking-widest">
                  Product Type
                </th>
                <th className="px-8 py-4 text-xs font-semibold uppercase tracking-widest">
                  Category
                </th>
                <th className="px-8 py-4 text-xs font-semibold uppercase tracking-widest">
                  Price
                </th>
                <th className="px-8 py-4 text-xs font-semibold uppercase tracking-widest">
                  Supplier
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const productId = p.Id ?? p.id;

                  return (
                    <tr
                      key={productId}
                      onClick={() => navigate(`/products/${productId}`)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-8 py-4">
                        <div className="text-sm font-bold">
                          {p.Name ?? p.name ?? "Unnamed Product"}
                        </div>
                        <div className="text-xs text-gray-600">
                          {p.ProductCode ?? p.productCode ?? "-"}
                        </div>
                      </td>

                      <td className="px-8 py-4 text-sm">
                        {formatProductType(p.ProductType ?? p.productType)}
                      </td>

                      <td className="px-8 py-4 text-sm">
                        {p.Category ?? p.category ?? "-"}
                      </td>

                      <td className="px-8 py-4 text-sm">
                        {formatCurrency(p.SellPrice ?? p.sellPrice)}
                      </td>

                      <td className="px-8 py-4 text-sm">
                        {p.SupplierName ?? p.supplierName ?? "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-sm">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔥 FOOTER (UPDATED) */}
        <div className="flex flex-col gap-3 border-t border-gray-300 bg-white p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="rounded border border-gray-300 px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <span>
              Showing {paginatedProducts.length} of {filteredProducts.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="rounded border px-3 py-1 hover:bg-accent hover:text-white disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded border px-3 py-1 hover:bg-accent hover:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatProductType = (value) => {
  const map = {
    FinishedGood: "Finished Good",
    Material: "Material",
    Labour: "Labour",
    Accessory: "Accessory",
  };

  return map[value] || value || "-";
};