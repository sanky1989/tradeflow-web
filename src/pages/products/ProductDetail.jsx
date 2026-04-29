import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  // 🔹 LOAD PRODUCT
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await productService.getById(id);

        if (!res.Success) {
          throw new Error(res.Message);
        }

        setProduct(res.Data);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  // 🔹 LOAD INVENTORY
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await productService.getInventory(id);
        setInventory(res.Data);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load inventory");
      } finally {
        setInventoryLoading(false);
      }
    };

    if (id) loadInventory();
  }, [id]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
            <button
             onClick={() => navigate(`/products`)}
             type="button" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg> Back to Product</button>
          <h2 className="text-2xl font-bold text-black">
            {product.Name}
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            Product details and inventory
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
        <button
         onClick={() => navigate(`/products/${id}/edit`)}
         className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg> Edit</button>
        </div>
        
      </div>

      {/* PRODUCT INFO */}
      <div className="rounded-xl border border-gray-300 bg-white p-6">
        <h3 className="text-lg font-bold text-black mb-4">
          Product Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
          <Detail label="Product Code" value={product.ProductCode} />
          <Detail label="Category" value={product.Category} />
          <Detail label="Product Type" value={product.ProductType} />
          <Detail label="Supplier" value={product.SupplierName} />
          <Detail label="Base Cost" value={formatCurrency(product.BaseCost)} />
          <Detail label="Sell Price" value={formatCurrency(product.SellPrice)} />
          <Detail label="Stock Tracked" value={product.IsStockTracked ? "Yes" : "No"} />
          <Detail label="Active" value={product.IsActive ? "Yes" : "No"} />
        </div>
      </div>

      {/* INVENTORY SECTION */}
      <div className="rounded-xl border border-gray-300 bg-white p-6">
        <h3 className="text-lg font-bold text-black mb-4">
          Inventory
        </h3>

        {inventoryLoading ? (
          <p className="text-sm text-gray-500">Loading inventory...</p>
        ) : inventory ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InventoryCard label="Available Qty" value={inventory.AvailableQty} />
            <InventoryCard label="Reserved Qty" value={inventory.ReservedQty} />
            <InventoryCard label="Reorder Level" value={inventory.ReorderLevel} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No inventory data</p>
        )}
      </div>
    </div>
  );
}

// 🔹 DETAIL COMPONENT
const Detail = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold">{value || "-"}</p>
  </div>
);

// 🔹 INVENTORY CARD
const InventoryCard = ({ label, value }) => (
  <div className="rounded-lg border border-gray-300 p-4 bg-white">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-xl font-bold text-black mt-1">
      {value ?? 0}
    </p>
  </div>
);

export default ProductDetail;