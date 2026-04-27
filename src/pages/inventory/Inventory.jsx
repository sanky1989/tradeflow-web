import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Edit3,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import { inventoryService } from "../../services/inventoryService";

const getValue = (obj, pascal, camel, fallback = "") =>
  obj?.[pascal] ?? obj?.[camel] ?? fallback;

const numberValue = (value) => Number(value || 0);

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [adjustItem, setAdjustItem] = useState(null);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) => {
      const name = getValue(item, "ProductName", "productName").toLowerCase();
      const code = getValue(item, "ProductCode", "productCode").toLowerCase();
      return name.includes(term) || code.includes(term);
    });
  }, [items, search]);

  const totalProducts = items.length;

  const lowStockCount = items.filter(
    (item) =>
      numberValue(getValue(item, "AvailableQty", "availableQty")) <=
      numberValue(getValue(item, "ReorderLevel", "reorderLevel"))
  ).length;

  const reservedTotal = items.reduce(
    (sum, item) =>
      sum + numberValue(getValue(item, "ReservedQty", "reservedQty")),
    0
  );

  const handleEditSave = async (payload) => {
    const productId = getValue(editItem, "ProductId", "productId");

    const request = {
      ProductId: productId,
      AvailableQty: Number(payload.availableQty),
      ReservedQty: Number(payload.reservedQty),
      ReorderLevel: Number(payload.reorderLevel),
      Reason: payload.reason || "Inventory updated from TradeFlow web",
    };

    try {
      setSaving(true);
      await inventoryService.update(productId, request);
      toast.success("Inventory updated");
      setEditItem(null);
      await loadInventory();
    } catch (err) {
      toast.error(err.message || "Failed to update inventory");
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustSave = async (payload) => {
    const productId = getValue(adjustItem, "ProductId", "productId");

    const request = {
      AvailableDelta: Number(payload.availableDelta),
      ReservedDelta: Number(payload.reservedDelta || 0),
      AdjustmentType:
        Number(payload.availableDelta) >= 0 ? "StockIn" : "StockOut",
      Reason: payload.reason || "Manual stock adjustment",
    };

    try {
      setSaving(true);
      await inventoryService.adjust(productId, request);
      toast.success("Stock adjusted");
      setAdjustItem(null);
      await loadInventory();
    } catch (err) {
      toast.error(err.message || "Failed to adjust stock");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Inventory</h1>
          <p className="text-sm text-gray-600">
            Manage available stock, reserved quantities and reorder thresholds.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInventory}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={20} />}
        />
        <SummaryCard
          title="Low Stock"
          value={lowStockCount}
          tone="warning"
          icon={<AlertTriangle size={20} />}
        />
        <SummaryCard
          title="Reserved Qty"
          value={reservedTotal}
          icon={<SlidersHorizontal size={20} />}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Stock Register
            </h2>
            <p className="text-sm text-slate-500">
              Review and update inventory levels.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or code..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Available</th>
                <th className="px-5 py-3 font-semibold">Reserved</th>
                <th className="px-5 py-3 font-semibold">Reorder Level</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const productId = getValue(item, "ProductId", "productId");
                const productName = getValue(
                  item,
                  "ProductName",
                  "productName",
                  "Unnamed product"
                );
                const productCode = getValue(
                  item,
                  "ProductCode",
                  "productCode",
                  ""
                );
                const availableQty = numberValue(
                  getValue(item, "AvailableQty", "availableQty")
                );
                const reservedQty = numberValue(
                  getValue(item, "ReservedQty", "reservedQty")
                );
                const reorderLevel = numberValue(
                  getValue(item, "ReorderLevel", "reorderLevel")
                );
                const isLowStock = availableQty <= reorderLevel;

                return (
                  <tr key={productId} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {productName}
                      </div>
                      {productCode && (
                        <div className="text-xs text-slate-500">
                          Code: {productCode}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {availableQty}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{reservedQty}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {reorderLevel}
                    </td>
                    <td className="px-5 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                          <AlertTriangle size={13} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditItem(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdjustItem(item)}
                          className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editItem && (
        <EditInventoryModal
          item={editItem}
          saving={saving}
          onClose={() => setEditItem(null)}
          onSave={handleEditSave}
        />
      )}

      {adjustItem && (
        <AdjustInventoryModal
          item={adjustItem}
          saving={saving}
          onClose={() => setAdjustItem(null)}
          onSave={handleAdjustSave}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : "bg-purple-50 text-purple-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${toneClass}`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function EditInventoryModal({ item, saving, onClose, onSave }) {
  const [availableQty, setAvailableQty] = useState(
    getValue(item, "AvailableQty", "availableQty", 0)
  );
  const [reservedQty, setReservedQty] = useState(
    getValue(item, "ReservedQty", "reservedQty", 0)
  );
  const [reorderLevel, setReorderLevel] = useState(
    getValue(item, "ReorderLevel", "reorderLevel", 0)
  );
  const [reason, setReason] = useState(
    "Inventory updated from TradeFlow web"
  );

  const submit = (e) => {
    e.preventDefault();

    onSave({
      availableQty: Number(availableQty),
      reservedQty: Number(reservedQty),
      reorderLevel: Number(reorderLevel),
      reason,
    });
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
  const [reason, setReason] = useState("Manual stock adjustment");

  const submit = (e) => {
    e.preventDefault();

    onSave({
      availableDelta: Number(availableDelta),
      reservedDelta: Number(reservedDelta),
      reason,
    });
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

        <ModalActions
          saving={saving}
          onClose={onClose}
          saveText="Adjust Stock"
        />
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