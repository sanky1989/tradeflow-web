import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { productService } from "../../services/productService";
import SelectizeInput from "../../components/common/SelectizeInput";
import toast from "react-hot-toast";

function ProductBomEditor({ productId }) {
  const [allProducts, setAllProducts] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (productId) loadData();
  }, [productId]);

  const data = (res) => res?.Data ?? res?.data ?? [];

  const loadData = async () => {
    try {
      setLoading(true);

      const [productsRes, componentsRes] = await Promise.all([
        productService.getAll(),
        productService.getComponents(productId),
      ]);

      setAllProducts(data(productsRes));
      setComponents(
        data(componentsRes).map((x, index) => ({
          ComponentProductId: x.ComponentProductId ?? x.componentProductId ?? "",
          QuantityRequired: x.QuantityRequired ?? x.quantityRequired ?? 1,
          IsMandatory: x.IsMandatory ?? x.isMandatory ?? true,
          ComponentType: x.ComponentType ?? x.componentType ?? "Material",
          CalculationType: x.CalculationType ?? x.calculationType ?? "Fixed",
          WasteFactor: x.WasteFactor ?? x.wasteFactor ?? 0,
          IsIncludedInPrice: x.IsIncludedInPrice ?? x.isIncludedInPrice ?? true,
          SortOrder: x.SortOrder ?? x.sortOrder ?? index + 1,
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Unable to load components");
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    setComponents((prev) => [
      ...prev,
      {
        ComponentProductId: "",
        QuantityRequired: 1,
        IsMandatory: true,
        ComponentType: "Material",
        CalculationType: "Fixed",
        WasteFactor: 0,
        IsIncludedInPrice: true,
        SortOrder: prev.length + 1,
      },
    ]);
  };

  const updateRow = (index, field, value) => {
    setComponents((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeRow = (index) => {
    setComponents((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((x, i) => ({ ...x, SortOrder: i + 1 }))
    );
  };

  const save = async () => {
    const payload = components.map((x, index) => ({
      ComponentProductId: x.ComponentProductId,
      QuantityRequired: Number(x.QuantityRequired || 0),
      IsMandatory: Boolean(x.IsMandatory),
      ComponentType: x.ComponentType || "Material",
      CalculationType: x.CalculationType || "Fixed",
      WasteFactor: Number(x.WasteFactor || 0),
      IsIncludedInPrice: Boolean(x.IsIncludedInPrice),
      SortOrder: Number(x.SortOrder || index + 1),
    }));

    if (payload.some((x) => !x.ComponentProductId)) {
      toast.error("Please select all component products");
      return;
    }

    if (payload.some((x) => x.ComponentProductId === productId)) {
      toast.error("Product cannot be its own component");
      return;
    }

    if (payload.some((x) => x.QuantityRequired <= 0)) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      setSaving(true);
      await productService.updateComponents(productId, payload);
      toast.success("Components saved");
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unable to save components");
    } finally {
      setSaving(false);
    }
  };

  const productOptions = allProducts
    .filter((p) => (p.Id ?? p.id) !== productId)
    .map((p) => ({
      value: p.Id ?? p.id,
      label: `${p.Name ?? p.name} (${p.ProductCode ?? p.productCode ?? "-"})`,
    }));

  if (loading) {
    return <p className="text-sm text-gray-500">Loading components...</p>;
  }

  return (
    <div className="space-y-4">
      {components.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-5 text-sm text-gray-600">
          No components added yet. Add fabric, track, brackets, accessories or labour.
        </div>
      ) : (
        <div className="space-y-4">
          {components.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-300 bg-white p-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                  <label className="text-sm font-semibold text-black">
                    Component Product
                  </label>
                  <SelectizeInput
                    name="ComponentProductId"
                    value={item.ComponentProductId}
                    onChange={(e) =>
                      updateRow(index, "ComponentProductId", e.target.value)
                    }
                    placeholder="Select component product"
                    options={productOptions}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-black">
                    Component Type
                  </label>
                  <select
                    value={item.ComponentType}
                    onChange={(e) =>
                      updateRow(index, "ComponentType", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="Material">Material</option>
                    <option value="Accessory">Accessory</option>
                    <option value="Labour">Labour</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-black">
                    Calculation
                  </label>
                  <select
                    value={item.CalculationType}
                    onChange={(e) =>
                      updateRow(index, "CalculationType", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="PerCurtain">Per Curtain</option>
                    <option value="PerWidthMetre">Per Width Metre</option>
                    <option value="PerHeightMetre">Per Height Metre</option>
                    <option value="PerSquareMetre">Per Square Metre</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-semibold text-black">
                    Qty
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.QuantityRequired}
                    onChange={(e) =>
                      updateRow(index, "QuantityRequired", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-semibold text-black">
                    Waste %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.WasteFactor}
                    onChange={(e) =>
                      updateRow(index, "WasteFactor", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="md:col-span-1 flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50"
                    title="Remove component"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.IsMandatory}
                    onChange={(e) =>
                      updateRow(index, "IsMandatory", e.target.checked)
                    }
                  />
                  Mandatory
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.IsIncludedInPrice}
                    onChange={(e) =>
                      updateRow(index, "IsIncludedInPrice", e.target.checked)
                    }
                  />
                  Included in price
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          <Plus size={16} />
          Add Component
        </button>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Components"}
        </button>
      </div>
    </div>
  );
}

export default ProductBomEditor;