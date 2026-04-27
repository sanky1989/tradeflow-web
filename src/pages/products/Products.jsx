// pages/Products.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import Loader from "../../components/common/Loader";
import { Pencil, Search } from "lucide-react";

// SearchBar Component
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-1 max-md:max-w-none w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black"
      />
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, setCurrentPage, filteredProductsLength }) => {
  return (
    <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between text-[11px] text-black">
      <span>
        Showing {filteredProductsLength} of {filteredProductsLength} products
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
  );
};

// TableRow Component
const TableRow = ({ product }) => {
  const navigate = useNavigate();
  return (
    <tr key={product.Id} className="group transition-colors cursor-pointer">
      <td className="px-8 py-4">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[13px] font-bold text-black">{product.Name}</span>
            <span className="text-[11px] text-gray-900 block">{product.ProductType}</span>
          </div>
        </div>
      </td>
      <td className="px-8 py-4">
        <div>
          <span className="text-[13px] font-medium text-black">{product.SupplierName}</span>
          <span className="text-[12px] text-gray-900 block">{product.ProductCode}</span>
        </div>
      </td>
      <td className="px-8 py-4 text-[13px] text-gray-900">₹ {product.SellPrice}</td>
      <td className="px-8 py-4 text-[13px] text-gray-900">{product.Category}</td>
      <td className="px-8 py-4">
        <button onClick={() => navigate(`/products/${product.Id}/edit`)}>
          <Pencil size={16} className="text-gray-900" />
        </button>
      </td>
    </tr>
  );
};

// Custom Hook for Pagination
const usePagination = (data, itemsPerPage, searchQuery) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((item) => {
    return (
      item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ProductCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.SupplierName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData,
    paginatedData
  };
};

// Main Products Page Component
const Products = () => {
  const navigate = useNavigate();
  const [PRODUCT_DATA, setPRODUCT_DATA] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // Fetch product data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getAll();
        setPRODUCT_DATA(res.Data);
      } catch (err) {
        console.log("Load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData,
    paginatedData
  } = usePagination(PRODUCT_DATA, itemsPerPage, searchQuery);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Products</h2>
          <p className="text-sm font-medium text-gray-900 mt-1">Manage your products</p>
        </div>
        <button
          onClick={() => navigate("/products/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
        >
          Add Product
        </button>
      </div>

      {/* SEARCH */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* TABLE */}
      <div className="rounded-xl border border-gray-300 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Product</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Supplier & Code</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Price</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Category</th>
                <th className="px-8 py-4 text-[12px] uppercase font-semibold text-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 border-b border-gray-300">
              {paginatedData.length > 0 ? (
                paginatedData.map((p) => <TableRow key={p.Id} product={p} />)
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          filteredProductsLength={filteredData.length}
        />
      </div>
    </div>
  );
};

export default Products;