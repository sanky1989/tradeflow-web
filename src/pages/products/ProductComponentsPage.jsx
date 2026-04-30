import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import Loader from "../../components/common/Loader";
import ProductBomEditor from "./ProductBomEditor";
import toast from "react-hot-toast";

function ProductComponentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const res = await productService.getById(id);

        if (res?.Success === false || res?.success === false) {
          toast.error(res?.Message || res?.message || "Unable to load product setup");
          return;
        }

        setProduct(res?.Data ?? res?.data ?? null);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Unable to load product setup");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
        Product not found
      </div>
    );
  }

  const productName = product.Name ?? product.name ?? "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            ← Back to Product Setup
          </button>

          <h2 className="text-2xl font-bold text-black">Components Setup</h2>

          <p className="mt-1 text-sm text-gray-700">
            Configure fabric, track, brackets, labour and other components for{" "}
            <span className="font-semibold text-black">{productName}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/products/${id}/edit`)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-50"
        >
          Edit Product
        </button>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        Add materials, labour and accessories to define how this product is built.
        These components are used for pricing and quote calculations.
      </div>

      {/* BOM Editor */}
      <ProductBomEditor productId={id} />
    </div>
  );
}

export default ProductComponentsPage;