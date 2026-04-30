import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { supplierService } from "../../services/supplierService";
import SelectizeInput from "../../components/common/SelectizeInput";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const getValue = (obj, pascal, camel, fallback = "") =>
  obj?.[pascal] ?? obj?.[camel] ?? fallback;

const productTypeOptions = [
  { value: "FinishedGood", label: "Finished Good" },
  { value: "Material", label: "Material" },
  { value: "Labour", label: "Labour" },
  { value: "Accessory", label: "Accessory" },
];

const categoryOptions = [
  { value: "Curtains", label: "Curtains" },
  { value: "Blinds", label: "Blinds" },
  { value: "Fabric", label: "Fabric" },
  { value: "Hardware", label: "Hardware" },
  { value: "Tracks", label: "Tracks" },
  { value: "Frames", label: "Frames" },
  { value: "Accessories", label: "Accessories" },
  { value: "Labour", label: "Labour" },
];

export default function EditProductModal({ productId, onClose, onSaved }) {
  const [form, setForm] = useState({
    ProductCode: "",
    Name: "",
    Category: "",
    ProductType: "",
    BaseCost: "",
    SellPrice: "",
    SupplierId: "",
    IsStockTracked: false,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, [productId]);

  const load = async () => {
    try {
      setLoading(true);

      const [productRes, supplierRes] = await Promise.all([
        productService.getById(productId),
        supplierService.getAll(),
      ]);

      const p = productRes?.Data ?? productRes?.data ?? null;
      const supplierData = supplierRes?.Data ?? supplierRes?.data ?? [];

      setSuppliers(Array.isArray(supplierData) ? supplierData : []);

      setForm({
        ProductCode: getValue(p, "ProductCode", "productCode"),
        Name: getValue(p, "Name", "name"),
        Category: getValue(p, "Category", "category"),
        ProductType: getValue(p, "ProductType", "productType"),
        BaseCost: getValue(p, "BaseCost", "baseCost", ""),
        SellPrice: getValue(p, "SellPrice", "sellPrice", ""),
        SupplierId: getValue(p, "SupplierId", "supplierId", ""),
        IsStockTracked: getValue(p, "IsStockTracked", "isStockTracked", false),
      });
    } catch (err) {
      toast.error(err.message || "Unable to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    if (name === "ProductType") {
      const isLabour = value === "Labour";

      setForm((prev) => ({
        ...prev,
        ProductType: value,
        IsStockTracked: isLabour ? false : prev.IsStockTracked,
        SupplierId: isLabour ? "" : prev.SupplierId,
      }));

      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const isLabour = form.ProductType === "Labour";

      await productService.update(productId, {
        SupplierId: isLabour ? null : form.SupplierId,
        ProductCode: form.ProductCode.trim(),
        Name: form.Name.trim(),
        Category: form.Category,
        ProductType: form.ProductType,
        BaseCost: Number(form.BaseCost || 0),
        SellPrice: Number(form.SellPrice || 0),
        IsStockTracked: isLabour ? false : form.IsStockTracked,
      });

      toast.success("Product updated");
      await onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || "Unable to update product");
    } finally {
      setSaving(false);
    }
  };

  const supplierOptions = (suppliers || [])
    .map((s) => ({
      value: s.Id ?? s.id ?? s.SupplierId ?? s.supplierId,
      label:
        s.Name ??
        s.name ??
        s.SupplierName ??
        s.supplierName ??
        s.ContactName ??
        s.contactName ??
        "Unnamed Supplier",
    }))
    .filter((x) => x.value);

  const isLabour = form.ProductType === "Labour";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Edit Product</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-gray-500 hover:text-black"
          >
            Close
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Product Name"
                value={form.Name}
                onChange={(v) => handleChange("Name", v)}
              />

              <Input
                label="Product Code"
                value={form.ProductCode}
                onChange={(v) => handleChange("ProductCode", v)}
              />

              <Select
                name="Category"
                label="Category"
                value={form.Category}
                options={categoryOptions}
                onChange={(v) => handleChange("Category", v)}
              />

              <Select
                name="ProductType"
                label="Product Type"
                value={form.ProductType}
                options={productTypeOptions}
                onChange={(v) => handleChange("ProductType", v)}
              />

              <Input
                label="Base Cost"
                type="number"
                value={form.BaseCost}
                onChange={(v) => handleChange("BaseCost", v)}
              />

              <Input
                label="Sell Price"
                type="number"
                value={form.SellPrice}
                onChange={(v) => handleChange("SellPrice", v)}
              />

              {!isLabour ? (
                <Select
                  key={`supplier-${supplierOptions.length}-${form.SupplierId}`}
                  name="SupplierId"
                  label="Supplier"
                  value={form.SupplierId}
                  options={supplierOptions}
                  onChange={(v) => handleChange("SupplierId", v)}
                  placeholder="Select supplier"
                />
              ) : (
                <div className="space-y-1">
                  <label className="text-sm text-black">Supplier</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    Not required for labour / installation services
                  </div>
                </div>
              )}

              <div className="mt-7">
                <label className="inline-flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white p-3">
                  <input
                    type="checkbox"
                    checked={Boolean(form.IsStockTracked)}
                    disabled={isLabour}
                    onChange={(e) =>
                      handleChange("IsStockTracked", e.target.checked)
                    }
                    className="h-4 w-4 cursor-pointer accent-accent disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-sm text-black">Track Stock</span>
                    <p className="text-xs text-gray-500">
                      Labour / installation should not track stock.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-sm text-black">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black"
    />
  </div>
);

const Select = ({
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
}) => (
  <div className="space-y-1">
    <label className="text-sm text-black">{label}</label>
    <SelectizeInput
      name={name}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      placeholder={placeholder}
    />
  </div>
);