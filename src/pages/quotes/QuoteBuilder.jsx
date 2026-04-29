import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../../services/productService";
import { customerService } from "../../services/customerService";
import { quoteService } from "../../services/quoteService";

const getValue = (obj, pascal, camel, fallback = "") =>
  obj?.[pascal] ?? obj?.[camel] ?? fallback;

const getApiData = (res) => res?.Data || res?.data || res || [];

const getId = (obj) =>
  getValue(obj, "Id", "id") || getValue(obj, "ProductId", "productId");

export default function QuoteBuilder() {
  const { id: routeQuoteId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [productRes, customerRes] = await Promise.all([
        productService.getAll(),
        customerService.getAll(),
      ]);

      setProducts(getApiData(productRes));
      setCustomers(getApiData(customerRes));
    } catch (err) {
      toast.error("Failed to load quote builder data");
      console.error(err);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        productName: "",
        width: 1,
        height: 1,
        qty: 1,
        cost: 0,
        margin: 30,
        total: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const calculateTotal = (item) => {
    const width = Number(item.width || 0);
    const height = Number(item.height || 0);
    const qty = Number(item.qty || 0);
    const cost = Number(item.cost || 0);
    const margin = Number(item.margin || 0);

    const baseCost = width * height * cost;
    const sell = baseCost + (baseCost * margin) / 100;

    return sell * qty;
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updated[index].total = calculateTotal(updated[index]);
    setItems(updated);
  };

  const productName = (product) =>
    getValue(product, "Name", "name") ||
    getValue(product, "ProductName", "productName") ||
    "Unnamed product";

  const handleProductChange = (index, productId) => {
    const product = products.find((p) => String(getId(p)) === String(productId));

    const productCost =
      getValue(product, "UnitCost", "unitCost", null) ??
      getValue(product, "CostPrice", "costPrice", null) ??
      getValue(product, "Price", "price", null) ??
      getValue(product, "UnitPrice", "unitPrice", null) ??
      getValue(product, "BasePrice", "basePrice", 0);

    const updated = [...items];

    updated[index] = {
      ...updated[index],
      productId,
      productName: productName(product),
      cost: Number(productCost || 0),
    };

    updated[index].total = calculateTotal(updated[index]);
    setItems(updated);
  };

  const validate = () => {
    if (!routeQuoteId && !customerId) {
      toast.error("Please select customer");
      return false;
    }

    if (!items.length) {
      toast.error("Please add at least one item");
      return false;
    }

    if (items.some((x) => !x.productId)) {
      toast.error("Please select product for all rows");
      return false;
    }

    return true;
  };

  const createQuoteIfNeeded = async () => {
    if (routeQuoteId) return routeQuoteId;

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const quote = await quoteService.create({
      CustomerId: customerId,
      CustomerSiteId: null,
      AssignedInstallerUserId: null,
      ExpiryDateUtc: expiry.toISOString(),
      InternalNotes: "",
      CustomerNotes: customerNotes,
      TermsAndConditionsHtml: "",
      ExternalJobId: null,
      DiscountType: null,
      DiscountValue: 0,
      AdditionalChargeAmount: 0,
      Measurements: [],
    });

    return getValue(quote, "Id", "id");
  };

  const saveQuote = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      const quoteId = await createQuoteIfNeeded();

      for (const item of items) {
        await quoteService.addItem(quoteId, {
          ProductId: item.productId,
          Description: `${item.productName || "Quote item"} (${item.width}m x ${item.height}m)`,
          Quantity: Number(item.qty || 0),
          Width: Number(item.width || 0),
          Height: Number(item.height || 0),
          RequestedMarginPercent: Number(item.margin || 0),
        });
      }

      const calculated = await quoteService.calculate(quoteId);
      console.log("Quote calculated", calculated);

      toast.success("Quote saved and calculated successfully");
      navigate(`/quotes/${quoteId}/builder`);
    } catch (err) {
      toast.error(err.message || "Failed to save quote");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.total || 0), 0);
  }, [items]);

  const customerName = (customer) =>
    getValue(customer, "DisplayName", "displayName") ||
    getValue(customer, "CompanyName", "companyName") ||
    getValue(customer, "ContactName", "contactName") ||
    getValue(customer, "Name", "name") ||
    getValue(customer, "FullName", "fullName") ||
    "Unnamed customer";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Quote Builder</h1>
          <p className="text-sm text-slate-600">
            Create quote, add items, apply margin and save.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveQuote}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Quote"}
          </button>

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            + Add Item
          </button>
        </div>
      </div>

      {!routeQuoteId && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
            Customer
          </label>

          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => {
              const id = getValue(customer, "Id", "id");
              return (
                <option key={id} value={id}>
                  {customerName(customer)}
                </option>
              );
            })}
          </select>

          <textarea
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Customer notes optional..."
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Click “Add Item” to start building this quote.
          </div>
        )}

        {items.length > 0 && (
          <div className="hidden xl:grid xl:grid-cols-12 text-xs font-semibold uppercase text-slate-500">
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Width</div>
            <div className="col-span-2">Height</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-1">Cost</div>
            <div className="col-span-1">Margin</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
        )}

        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-slate-200 p-3">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-12 xl:items-center">
              <div className="xl:col-span-3">
                <select
                  value={item.productId}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => {
                    const id = getId(product);
                    return (
                      <option key={id} value={id}>
                        {productName(product)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <input
                type="number"
                value={item.width}
                onChange={(e) => updateItem(index, "width", e.target.value)}
                className="xl:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />

              <input
                type="number"
                value={item.height}
                onChange={(e) => updateItem(index, "height", e.target.value)}
                className="xl:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />

              <input
                type="number"
                value={item.qty}
                onChange={(e) => updateItem(index, "qty", e.target.value)}
                className="xl:col-span-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />

              <input
                type="number"
                value={item.cost}
                onChange={(e) => updateItem(index, "cost", e.target.value)}
                className="xl:col-span-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />

              <input
                type="number"
                value={item.margin}
                onChange={(e) => updateItem(index, "margin", e.target.value)}
                className="xl:col-span-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />

              <div className="xl:col-span-1 font-bold">
                ${Number(item.total || 0).toFixed(2)}
              </div>

              <div className="xl:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm font-semibold text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="text-right text-xl font-bold">
            Grand Total: ${grandTotal.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}