import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { supplierService } from "../../services/supplierService";
import { useAuth } from "../../context/AuthContext";
import SelectizeInput from "../../components/common/SelectizeInput";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const generateCode = (name) =>
  name?.replace(/\s+/g, "-").toUpperCase().substring(0, 10) || "PRD";

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

function ProductCreate() {
  const navigate = useNavigate();
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
  const [supplierLoading, setSupplierLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setSupplierLoading(true);
        const res = await supplierService.getAll();
        const data = res?.Data ?? res?.data ?? [];
        setSuppliers(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.message || "Unable to load suppliers");
      } finally {
        setSupplierLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "ProductType") {
      const isLabour = value === "Labour";

      setForm((prev) => ({
        ...prev,
        ProductType: value,
        IsStockTracked: isLabour ? false : prev.IsStockTracked,
        SupplierId: isLabour ? "" : prev.SupplierId,
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

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    const isLabour = form.ProductType === "Labour";

    if (!form.Name?.trim()) e.Name = "Product name required";
    if (!form.Category?.trim()) e.Category = "Select category";
    if (!form.ProductType?.trim()) e.ProductType = "Select product type";

    if (form.BaseCost === "" || Number(form.BaseCost) < 0) {
      e.BaseCost = "Base cost required";
    }

    if (form.SellPrice === "" || Number(form.SellPrice) < 0) {
      e.SellPrice = "Sell price required";
    }

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
        ProductCode: form.ProductCode?.trim() || generateCode(form.Name),
        Name: form.Name.trim(),
        Category: form.Category,
        ProductType: form.ProductType,
        BaseCost: Number(form.BaseCost || 0),
        SellPrice: Number(form.SellPrice || 0),
        IsStockTracked: isLabour ? false : form.IsStockTracked,
      };

      const res = await productService.create(payload);
      const createdProduct = res?.Data ?? res?.data;
      const createdProductId = createdProduct?.Id ?? createdProduct?.id;

      toast.success("Product created successfully");
      navigate(createdProductId ? `/products/${createdProductId}` : "/products");
    } catch (err) {
      toast.error(err.message || "Unable to create product");
    } finally {
      setSaving(false);
    }
  };

  const supplierOptions = suppliers
    .map((s) => ({
      value: s.Id ?? s.id,
      label: s.Name ?? s.name ?? "Unnamed Supplier",
    }))
    .filter((x) => x.value);

  if (supplierLoading) return <Loader />;

  const isLabour = form.ProductType === "Labour";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Create Product
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            Create product master data first. Inventory and components can be
            configured from Product Setup.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          Cancel
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
          placeholder="Optional - auto generated if blank"
        />

        <SelectField
          label="Category"
          name="Category"
          value={form.Category}
          onChange={handleChange}
          options={categoryOptions}
          placeholder="Select Category"
          error={errors.Category}
        />

        <SelectField
          label="Product Type"
          name="ProductType"
          value={form.ProductType}
          onChange={handleChange}
          options={productTypeOptions}
          placeholder="Select Product Type"
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
              disabled={isLabour}
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
          After creating the product, open Product Setup to manage inventory and
          components.
        </div>

        <div className="flex justify-end gap-3 md:col-span-2">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Product"}
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
  placeholder = "",
}) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>
    <input
      type={type}
      step={type === "number" ? "0.01" : undefined}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-black placeholder:text-gray-400 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default ProductCreate;