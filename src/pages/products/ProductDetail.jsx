import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Package } from "lucide-react";
import { productService } from "../../services/productService";
import { inventoryService } from "../../services/inventoryService";
import ProductBomEditor from "./ProductBomEditor";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import EditProductModal from "./EditProductModal";

const getValue = (obj, pascal, camel, fallback = "") =>
  obj?.[pascal] ?? obj?.[camel] ?? fallback;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [savingInventory, setSavingInventory] = useState(false);
  const [showEditInventory, setShowEditInventory] = useState(false);
  const [showAdjustInventory, setShowAdjustInventory] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productService.getById(id);
      setProduct(res?.Data ?? res?.data ?? null);
    } catch (err) {
      toast.error(err.message || "Unable to load product");
    } finally {
      setLoading(false);
    }
  };

  const reloadProductOnly = async () => {
    try {
      const res = await productService.getById(id);
      setProduct(res?.Data ?? res?.data ?? null);
    } catch (err) {
      toast.error(err.message || "Unable to reload product");
    }
  };

  const loadInventory = async () => {
    try {
      setInventoryLoading(true);
      const res = await productService.getInventory(id);
      setInventory(res?.Data ?? res?.data ?? null);
    } catch (err) {
      toast.error(err.message || "Unable to load inventory");
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
      loadInventory();
    }
  }, [id]);

  const handleEditInventorySave = async (payload) => {
    try {
      setSavingInventory(true);

      await inventoryService.update(id, {
        ProductId: id,
        AvailableQty: Number(payload.availableQty),
        ReservedQty: Number(payload.reservedQty),
        ReorderLevel: Number(payload.reorderLevel),
        Reason: payload.reason || "Inventory updated from Product Setup",
      });

      toast.success("Inventory updated");
      setShowEditInventory(false);
      await loadInventory();
    } catch (err) {
      toast.error(err.message || "Unable to update inventory");
    } finally {
      setSavingInventory(false);
    }
  };

  const handleAdjustInventorySave = async (payload) => {
    try {
      setSavingInventory(true);

      await inventoryService.adjust(id, {
        AvailableDelta: Number(payload.availableDelta),
        ReservedDelta: Number(payload.reservedDelta || 0),
        AdjustmentType:
          Number(payload.availableDelta) >= 0 ? "StockIn" : "StockOut",
        Reason: payload.reason || "Manual stock adjustment from Product Setup",
      });

      toast.success("Stock adjusted");
      setShowAdjustInventory(false);
      await loadInventory();
    } catch (err) {
      toast.error(err.message || "Unable to adjust stock");
    } finally {
      setSavingInventory(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
        Product not found
      </div>
    );
  }

  const productName = getValue(product, "Name", "name", "-");
  const isStockTracked = getValue(
    product,
    "IsStockTracked",
    "isStockTracked",
    false
  );

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/products")}
          type="button"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          ← Back to Products
        </button>

        <h2 className="text-2xl font-bold text-black">Product Setup</h2>

        <p className="mt-1 text-sm text-gray-700">
          Configure product details, inventory and components for{" "}
          <span className="font-semibold text-black">{productName}</span>.
        </p>
      </div>

      <div className="rounded-xl border border-gray-300 bg-white p-2">
        <div className="flex flex-wrap gap-2">
          <TabButton
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <TabButton
            label="Inventory"
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
          />
          <TabButton
            label="Components"
            active={activeTab === "components"}
            onClick={() => setActiveTab("components")}
          />
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="rounded-xl border border-gray-300 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black">Overview</h3>

            <button
              type="button"
              onClick={() => setShowEditProduct(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
            >
              <Pencil size={16} />
              Edit Product
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm text-black md:grid-cols-2">
            <Detail
              label="Product Code"
              value={getValue(product, "ProductCode", "productCode")}
            />
            <Detail
              label="Category"
              value={getValue(product, "Category", "category")}
            />
            <Detail
              label="Product Type"
              value={formatProductType(
                getValue(product, "ProductType", "productType")
              )}
            />
            <Detail
              label="Supplier"
              value={getValue(product, "SupplierName", "supplierName")}
            />
            <Detail
              label="Base Cost"
              value={formatCurrency(
                getValue(product, "BaseCost", "baseCost", 0)
              )}
            />
            <Detail
              label="Sell Price"
              value={formatCurrency(
                getValue(product, "SellPrice", "sellPrice", 0)
              )}
            />
            <Detail label="Stock Tracked" value={isStockTracked ? "Yes" : "No"} />
            <Detail
              label="Active"
              value={
                getValue(product, "IsActive", "isActive", false) ? "Yes" : "No"
              }
            />
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="rounded-xl border border-gray-300 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black">Inventory</h3>

            {isStockTracked && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditInventory(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
                >
                  <Package size={16} />
                  Edit Inventory
                </button>

                <button
                  type="button"
                  onClick={() => setShowAdjustInventory(true)}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  Adjust Stock
                </button>
              </div>
            )}
          </div>

          {!isStockTracked ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              Inventory is not tracked for this product.
            </div>
          ) : inventoryLoading ? (
            <p className="text-sm text-gray-500">Loading inventory...</p>
          ) : inventory ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <InventoryCard
                label="Available Qty"
                value={getValue(inventory, "AvailableQty", "availableQty", 0)}
              />
              <InventoryCard
                label="Reserved Qty"
                value={getValue(inventory, "ReservedQty", "reservedQty", 0)}
              />
              <InventoryCard
                label="Reorder Level"
                value={getValue(inventory, "ReorderLevel", "reorderLevel", 0)}
              />
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              No inventory data has been configured for this product.
            </div>
          )}
        </div>
      )}

      {activeTab === "components" && (
        <div className="rounded-xl border border-gray-300 bg-white p-6">
          <h3 className="mb-4 text-lg font-bold text-black">Components</h3>
          <ProductBomEditor productId={id} />
        </div>
      )}

      {showEditProduct && (
        <EditProductModal
          productId={id}
          onClose={() => setShowEditProduct(false)}
          onSaved={async () => {
            await reloadProductOnly();
            await loadInventory();
          }}
        />
      )}

      {showEditInventory && (
        <EditInventoryModal
          inventory={inventory}
          saving={savingInventory}
          onClose={() => setShowEditInventory(false)}
          onSave={handleEditInventorySave}
        />
      )}

      {showAdjustInventory && (
        <AdjustInventoryModal
          saving={savingInventory}
          onClose={() => setShowAdjustInventory(false)}
          onSave={handleAdjustInventorySave}
        />
      )}
    </div>
  );
}

const TabButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg px-4 py-2 text-sm font-bold ${
      active ? "bg-accent text-white" : "bg-white text-gray-700 hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

const Detail = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold">{value || "-"}</p>
  </div>
);

const InventoryCard = ({ label, value }) => (
  <div className="rounded-lg border border-gray-300 bg-white p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="mt-1 text-xl font-bold text-black">{value ?? 0}</p>
  </div>
);

function EditInventoryModal({ inventory, saving, onClose, onSave }) {
  const [availableQty, setAvailableQty] = useState(
    getValue(inventory, "AvailableQty", "availableQty", 0)
  );
  const [reservedQty, setReservedQty] = useState(
    getValue(inventory, "ReservedQty", "reservedQty", 0)
  );
  const [reorderLevel, setReorderLevel] = useState(
    getValue(inventory, "ReorderLevel", "reorderLevel", 0)
  );
  const [reason, setReason] = useState("Inventory updated from Product Setup");

  const submit = (e) => {
    e.preventDefault();
    onSave({ availableQty, reservedQty, reorderLevel, reason });
  };

  return (
    <Modal title="Edit Inventory" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <InventoryInput
          label="Available Qty"
          value={availableQty}
          onChange={setAvailableQty}
        />
        <InventoryInput
          label="Reserved Qty"
          value={reservedQty}
          onChange={setReservedQty}
        />
        <InventoryInput
          label="Reorder Level"
          value={reorderLevel}
          onChange={setReorderLevel}
        />

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">
            Reason
          </span>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </label>

        <ModalActions
          saving={saving}
          onClose={onClose}
          saveText="Save Changes"
        />
      </form>
    </Modal>
  );
}

function AdjustInventoryModal({ saving, onClose, onSave }) {
  const [availableDelta, setAvailableDelta] = useState(0);
  const [reservedDelta, setReservedDelta] = useState(0);
  const [reason, setReason] = useState(
    "Manual stock adjustment from Product Setup"
  );

  const submit = (e) => {
    e.preventDefault();
    onSave({ availableDelta, reservedDelta, reason });
  };

  return (
    <Modal title="Adjust Stock" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <InventoryInput
          label="Available Delta"
          value={availableDelta}
          onChange={setAvailableDelta}
        />
        <InventoryInput
          label="Reserved Delta"
          value={reservedDelta}
          onChange={setReservedDelta}
        />

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">
            Reason
          </span>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </label>

        <ModalActions saving={saving} onClose={onClose} saveText="Adjust Stock" />
      </form>
    </Modal>
  );
}

function InventoryInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
      />
    </label>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function ModalActions({ saving, onClose, saveText }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : saveText}
      </button>
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

export default ProductDetail;