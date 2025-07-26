import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Select from "react-select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "../../services/CategoryApi";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/AxiosIntance";
interface Props {
  setAddProduct: React.Dispatch<React.SetStateAction<boolean | null>>;
  //   categories: { _id: string; name: string }[];
}

const priceOptions = [
  { value: "per kg", label: "Per Kg" },
  { value: "per dozen", label: "Per Dozen" },
  { value: "per piece", label: "Per Piece" },
  { value: "bundle", label: "Bundle" },
];

const AddProduct = ({ setAddProduct }: Props) => {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });
  const [name, setName] = useState("");
  const [knownNames, setKnownNames] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [prices, setPrices] = useState<{ name: string; price: string }[]>([]);
  const [priceName, setPriceName] = useState(priceOptions[0]);
  const [priceValue, setPriceValue] = useState("");
  const [stock, setStock] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const handleAddPrice = () => {
    if (priceName && priceValue) {
      setPrices([...prices, { name: priceName.value, price: priceValue }]);
      setPriceValue("");
    }
  };
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("formData", formData);
      const res = await axiosInstance.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      setName("");
      setKnownNames([]);
      setSelectedCategories([]);
      setPrices([]);
      setPriceName(priceOptions[0]);
      setPriceValue("");
      setStock("");
      setImg(null);
      setDescription("");
      queryClient.invalidateQueries(["allProducts"]);
      setAddProduct(null);
      alert("Product updated successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("Product added successfully!");
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stock", stock);
    if (img) formData.append("img", img);
    formData.append("know_name", knownNames);
    console.log("selectedCategories", selectedCategories);

    selectedCategories.forEach((cat) => {
      formData.append("categories", cat.value);
    });
    prices.forEach((p, i) => {
      formData.append(`price[${i}][name]`, p.name);
      formData.append(`price[${i}][price]`, p.price);
    });

    createMutation.mutate(formData);
    // TODO: send formData to API
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-white p-4">
      <div className="relative w-full max-w-2xl">
        <ArrowBackIcon
          sx={{ fontSize: "1.5rem" }}
          onClick={() => setAddProduct(false)}
          className="cursor-pointer absolute top-0 left-0"
        />
        <h1 className="text-2xl text-center mb-6">Add Product</h1>
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
            options={categories.map((cat) => ({
              value: cat._id,
              label: cat.name,
            }))}
            onChange={(selected) => setSelectedCategories(selected)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Add Price Option</label>
          <div className="flex gap-2 items-center mt-1">
            <Select
              options={priceOptions}
              value={priceName}
              onChange={(val) => setPriceName(val!)}
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
                  onClick={() => {
                    setPrices(prices.filter((_, idx) => idx !== i));
                  }}
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
            onChange={(e) => setImg(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {img && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(img)}
                alt="Preview"
                className="h-16 w-16 object-contain border rounded shadow"
              />
            </div>
          )}
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
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
