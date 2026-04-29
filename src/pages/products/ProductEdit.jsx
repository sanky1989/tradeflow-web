import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { supplierService } from "../../services/supplierService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

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

  // 🔹 LOAD PRODUCT + SUPPLIERS
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [productRes, supplierRes] = await Promise.all([
          productService.getById(id),
          supplierService.getAll(),
        ]);

        const p = productRes.Data;

        setForm({
          ProductCode: p.ProductCode || "",
          Name: p.Name || "",
          Category: p.Category || "",
          ProductType: p.ProductType || "",
          BaseCost: p.BaseCost || "",
          SellPrice: p.SellPrice || "",
          SupplierId: p.SupplierId || "",
          IsStockTracked: p.IsStockTracked || false,
        });

        setSuppliers(supplierRes.Data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 🔹 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // 🔹 VALIDATION
  const validate = () => {
    const e = {};

    if (!form.Name?.trim()) e.Name = "Name required";
    if (!form.ProductCode?.trim()) e.ProductCode = "Code required";
    if (!form.Category?.trim()) e.Category = "Category required";
    if (!form.ProductType?.trim()) e.ProductType = "Type required";
    if (!form.BaseCost) e.BaseCost = "Base cost required";
    if (!form.SellPrice) e.SellPrice = "Sell price required";
    if (!form.SupplierId) e.SupplierId = "Supplier required";  // Supplier validation
    if (!form.IsStockTracked) e.IsStockTracked = "Stock tracking is required"; // Checkbox validation

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // 🔹 SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        TenantId: user?.TenantId,
        SupplierId: form.SupplierId,
        ProductCode: form.ProductCode,
        Name: form.Name,
        Category: form.Category,
        ProductType: form.ProductType,
        BaseCost: Number(form.BaseCost),
        SellPrice: Number(form.SellPrice),
        IsStockTracked: form.IsStockTracked,
      };

      const res = await productService.update(id, payload);

      if (!res.Success) {
        toast.error(res.Message || "Update failed");
        return;
      }

      toast.success("Product updated successfully ✅");
      navigate("/products");

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* HEADER SAME */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Edit Product</h2>
          <p className="mt-1 text-sm text-gray-700">Update product details</p>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {/* FORM SAME UI */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-6 rounded-xl border border-gray-300"
      >
        <Input label="Product Name" name="Name" value={form.Name} onChange={handleChange} error={errors.Name} />
        <Input label="Product Code" name="ProductCode" value={form.ProductCode} onChange={handleChange} error={errors.ProductCode} />
        <Input label="Category" name="Category" value={form.Category} onChange={handleChange} error={errors.Category} />
        <Input label="Product Type" name="ProductType" value={form.ProductType} onChange={handleChange} error={errors.ProductType} />
        <Input label="Base Cost" name="BaseCost" value={form.BaseCost} onChange={handleChange} error={errors.BaseCost} />
        <Input label="Sell Price" name="SellPrice" value={form.SellPrice} onChange={handleChange} error={errors.SellPrice} />

        {/* SUPPLIER */}
        <div className="space-y-1">
          <label className="text-black text-[14px]">Supplier</label>

          <select
            name="SupplierId"
            value={form.SupplierId || ""}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-sm text-black ${errors.SupplierId ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select Supplier</option>

            {suppliers.map((s) => (
              <option key={s.Id} value={s.Id}>
                {s.Name}
              </option>
            ))}
          </select>

          {errors.SupplierId && <p className="text-xs text-red-500">{errors.SupplierId}</p>}
        </div>

        {/* STOCK CHECKBOX */}
        <div className="mt-7 space-y-1 ">
          <label className="w-full inline-flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white p-2">
            <input
              type="checkbox"
              name="IsStockTracked"
              checked={form.IsStockTracked}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer accent-accent"
            />
            <div>
              <span className="text-sm  text-black">
                Track Stock
              </span>
            </div>
          </label>

          {errors.IsStockTracked && <p className="text-xs text-red-500">{errors.IsStockTracked}</p>}  {/* Display error for checkbox */}
        </div>

        {/* ACTIONS */}
        <div className="md:col-span-2 flex justify-end gap-3">
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
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

// 🔹 SAME INPUT COMPONENT
const Input = ({ label, name, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="text-black text-[14px]">{label}</label>

    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-black ${error ? "border-red-500" : "border-gray-300"}`}
    />

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default ProductEdit;