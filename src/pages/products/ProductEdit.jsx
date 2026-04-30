import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { supplierService } from "../../services/supplierService";
import { useAuth } from "../../context/AuthContext";
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

function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [productRes, supplierRes] = await Promise.all([
          productService.getById(id),
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
        console.error(err);
        toast.error(err.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "ProductType") {
      setForm((prev) => ({
        ...prev,
        ProductType: value,

        // Labour/Installation should not track inventory
        IsStockTracked: value === "Labour" ? false : prev.IsStockTracked,

        // Supplier optional for Labour/Installation
        SupplierId: value === "Labour" ? "" : prev.SupplierId,
      }));

      setErrors((prev) => ({
        ...prev,
        ProductType: "",
        SupplierId: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const e = {};
    const isLabour = form.ProductType === "Labour";

    if (!form.Name?.trim()) e.Name = "Product name required";
    if (!form.ProductCode?.trim()) e.ProductCode = "Product code required";
    if (!form.Category?.trim()) e.Category = "Select category";
    if (!form.ProductType?.trim()) e.ProductType = "Select product type";

    if (form.BaseCost === "" || Number(form.BaseCost) < 0) {
      e.BaseCost = "Base cost required";
    }

    if (form.SellPrice === "" || Number(form.SellPrice) < 0) {
      e.SellPrice = "Sell price required";
    }

    // Supplier is required for stock/material/accessory/finished goods, optional for labour
    if (!isLabour && !form.SupplierId) {
      e.SupplierId = "Select supplier";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      const isLabour = form.ProductType === "Labour";

      const payload = {
        TenantId: user?.TenantId ?? user?.tenantId,
        SupplierId: isLabour ? null : form.SupplierId,
        ProductCode: form.ProductCode.trim(),
        Name: form.Name.trim(),
        Category: form.Category,
        ProductType: form.ProductType,
        BaseCost: Number(form.BaseCost || 0),
        SellPrice: Number(form.SellPrice || 0),
        IsStockTracked: isLabour ? false : form.IsStockTracked,
      };

      const res = await productService.update(id, payload);

      if (res?.Success === false || res?.success === false) {
        toast.error(res?.Message || res?.message || "Unable to update product");
        return;
      }

      toast.success("Product updated successfully");
      navigate(`/products/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unable to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const supplierOptions = suppliers
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
  const stockDisabled = isLabour;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Edit Product</h2>
          <p className="mt-1 text-sm text-gray-700">
            Update basic product details only. Inventory and components are managed from Product Setup.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/products/${id}`)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          Back to Setup
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 rounded-xl border border-gray-300 bg-white p-6 md:grid-cols-2"
      >
        <Input
          label="Product Name"
          name="Name"
          value={form.Name}
          onChange={handleChange}
          error={errors.Name}
        />

        <Input
          label="Product Code"
          name="ProductCode"
          value={form.ProductCode}
          onChange={handleChange}
          error={errors.ProductCode}
        />

        <SelectField
          label="Category"
          name="Category"
          value={form.Category}
          onChange={handleChange}
          placeholder="Select Category"
          options={categoryOptions}
          error={errors.Category}
        />

        <SelectField
          label="Product Type"
          name="ProductType"
          value={form.ProductType}
          onChange={handleChange}
          placeholder="Select Product Type"
          options={productTypeOptions}
          error={errors.ProductType}
        />

        <Input
          label="Base Cost"
          name="BaseCost"
          type="number"
          value={form.BaseCost}
          onChange={handleChange}
          error={errors.BaseCost}
        />

        <Input
          label="Sell Price"
          name="SellPrice"
          type="number"
          value={form.SellPrice}
          onChange={handleChange}
          error={errors.SellPrice}
        />

        {!isLabour ? (
          <SelectField
            key={`supplier-${supplierOptions.length}`}
            label="Supplier"
            name="SupplierId"
            value={form.SupplierId}
            onChange={handleChange}
            options={supplierOptions}
            placeholder="Select Supplier"
            error={errors.SupplierId}
          />
        ) : (
          <div className="space-y-1">
            <label className="text-black text-[14px]">Supplier</label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
              Not required for labour / installation services
            </div>
          </div>
        )}

        <div className="mt-7 space-y-1">
          <label className="inline-flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white p-3">
            <input
              type="checkbox"
              name="IsStockTracked"
              checked={form.IsStockTracked}
              onChange={handleChange}
              disabled={stockDisabled}
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

        <div className="md:col-span-2 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          This screen updates master product details only. Use Product Setup for inventory and components.
        </div>

        <div className="flex justify-end gap-3 md:col-span-2">
          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
}) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>
    <SelectizeInput
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      error={error}
    />
  </div>
);

const Input = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>
    <input
      type={type}
      step={type === "number" ? "0.01" : undefined}
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-black ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default ProductEdit;