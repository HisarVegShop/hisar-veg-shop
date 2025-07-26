import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../../services/CategoryApi";
import axiosInstance from "../../services/AxiosIntance";
import Loader from "../Loader";

interface Category {
  _id: string;
  name: string;
}

interface Price {
  name: string;
  price: string;
}

interface Product {
  _id: string;
  name: string;
  know_name: string[];
  categories: Category[];
  price: Price[];
  stock: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface EditProductProps {
  product: Product;
  onClose: () => void;
}

const priceOptions: SelectOption[] = [
  { value: "per kg", label: "Per Kg" },
  { value: "per dozen", label: "Per Dozen" },
  { value: "per piece", label: "Per Piece" },
  { value: "bundle", label: "Bundle" },
];

const EditProduct = ({ product, onClose }: EditProductProps) => {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategory,
  });
  const [name, setName] = useState(product?.name || "");
  const [knownNames, setKnownNames] = useState<string[]>(
    product?.know_name || []
  );
  const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>(
    product?.categories?.map((cat) => ({ value: cat._id, label: cat.name })) ||
      []
  );
  const [prices, setPrices] = useState<Price[]>(product?.price || []);
  const [priceName, setPriceName] = useState<SelectOption>(priceOptions[0]);
  const [priceValue, setPriceValue] = useState("");
  const [stock, setStock] = useState(product?.stock || "");
  const [img, setImg] = useState<File | null>(null);
  const [description, setDescription] = useState(product?.description || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setName(product?.name || "");
    setKnownNames(product?.know_name || []);
    setSelectedCategories(
      product?.categories?.map((cat) => ({
        value: cat._id,
        label: cat.name,
      })) || []
    );
    setPrices(product?.price || []);
    setStock(product?.stock || "");
    setDescription(product?.description || "");
    setImg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // PATCH now matches backend
      const res = await axiosInstance.patch(
        `/api/products/${product._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allProducts"]);
      alert("Product updated successfully!");
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/api/products/${product._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allProducts"]);
      alert("Product deleted successfully!");
      onClose();
    },
    onError: () => {
      alert("Failed to delete product.");
    },
  });

  const handleAddPrice = () => {
    if (priceName && priceValue) {
      setPrices([...prices, { name: priceName.value, price: priceValue }]);
      setPriceValue("");
    }
  };

  const handleRemovePrice = (idx: number) => {
    setPrices(prices.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stock", stock);
    if (img) formData.append("img", img);
    formData.append("know_name", knownNames.join(","));
    selectedCategories.forEach((cat) => {
      formData.append("categories", cat.value);
    });
    prices.forEach((p, i) => {
      formData.append(`price[${i}][name]`, p.name);
      formData.append(`price[${i}][price]`, p.price);
    });
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    deleteMutation.mutate();
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-full h-full flex flex-col items-center bg-white p-4">
      <div className="relative w-full max-w-2xl">
        <button onClick={onClose} className="absolute top-0 left-0 text-lg">
          ✕
        </button>
        <h1 className="text-2xl text-center mb-6">Edit Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Known Names (comma-separated)
          </label>
          <input
            type="text"
            value={knownNames.join(", ")}
            onChange={(e) =>
              setKnownNames(e.target.value.split(",").map((s) => s.trim()))
            }
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Categories</label>
          <Select
            isMulti
            options={
              categories?.map((cat) => ({ value: cat._id, label: cat.name })) ||
              []
            }
            value={selectedCategories}
            onChange={(selected) => setSelectedCategories(selected)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Edit Price Option</label>
          <div className="flex gap-2 items-center mt-1">
            <Select
              options={priceOptions}
              value={priceName}
              onChange={(val) => setPriceName(val as SelectOption)}
              className="w-1/3"
            />
            <input
              type="number"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              placeholder="Price"
              className="w-1/3 border rounded px-2 py-1"
            />
            <button
              type="button"
              onClick={handleAddPrice}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 list-disc ml-5 text-sm">
            {prices.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                {p.name}: ₹{p.price}
                <button
                  type="button"
                  onClick={() => handleRemovePrice(i)}
                  className="ml-2 text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setImg(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          <div className="mt-2 flex items-center gap-4">
            {/* Show preview of new image if selected, else show current product image */}
            {img ? (
              <img
                src={URL.createObjectURL(img)}
                alt="Preview"
                className="h-16 w-16 object-contain border rounded shadow"
              />
            ) : product.img ? (
              <img
                src={import.meta.env.VITE_API_BASE_URL + product.img}
                alt="Current"
                className="h-16 w-16 object-contain border rounded shadow"
              />
            ) : null}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={handleDelete}
        >
          Delete Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
