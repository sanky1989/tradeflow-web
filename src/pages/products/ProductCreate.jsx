import { useState } from "react";
import { productService } from "../../services/productService";
import { useNavigate } from "react-router-dom";

export default function ProductCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Name: "",
    Price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await productService.create(form);
    alert("Created");
    navigate("/products");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="Name"
        placeholder="Name"
        onChange={(e) =>
          setForm({ ...form, Name: e.target.value })
        }
      />

      <input
        name="Price"
        placeholder="Price"
        onChange={(e) =>
          setForm({ ...form, Price: e.target.value })
        }
      />

      <button>Create</button>
    </form>
  );
}