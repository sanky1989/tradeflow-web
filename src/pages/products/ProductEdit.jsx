import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../../services/productService";

export default function ProductEdit() {
  const { id } = useParams();
  const [form, setForm] = useState({});

  useEffect(() => {
    const load = async () => {
      const res = await productService.getById(id);
      setForm(res.Data);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await productService.update(id, form);
    alert("Updated");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.Name || ""}
        onChange={(e) =>
          setForm({ ...form, Name: e.target.value })
        }
      />

      <input
        value={form.Price || ""}
        onChange={(e) =>
          setForm({ ...form, Price: e.target.value })
        }
      />

      <button>Update</button>
    </form>
  );
}