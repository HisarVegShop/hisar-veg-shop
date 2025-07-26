import React, { useState } from "react";
import { getCategory } from "../../services/CategoryApi.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader.tsx";
import EditCategoryItem from "./EditCategoryItem.tsx";
import axiosInstance from "../../services/AxiosIntance.ts";
import { useMutation } from "@tanstack/react-query";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditCategory = ({ setEditCategory }) => {
  const queryClient = useQueryClient();
  // Example initial state, replace with real data as needed
  const [name, setName] = useState("Sample Category");
  const [img, setImg] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { data: categoryList, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const createCategorMutation = useMutation({
    mutationFn: async (formData) => {
      // formData should be an instance of FormData
      const res = await axiosInstance.post("/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    onSuccess: (newCategory) => {
      // Update cache with new category
      setName("");
      setImg(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      queryClient.invalidateQueries(["categories"]);

      alert("Category saved!");
    },
  });
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic (API call)
    const formData = new FormData();
    formData.append("name", name);
    if (img) {
      formData.append("img", img);
    }
    createCategorMutation.mutate(formData);
  };

  const handleReset = () => {
    // TODO: Implement delete logic (API call)
    setName("");
    setImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="relative w-full h-full flex flex-col items-center justify-center ">
        {" "}
        <h1 className="text-2xl  mt-2">Add Category</h1>
        <div className="absolute top-2 left-0 px-4 py-1 rounded-full  flex justify-center items-center">
          <ArrowBackIcon
            sx={{ fontSize: "1.5rem" }}
            onClick={() => setEditCategory(false)}
          ></ArrowBackIcon>
        </div>
      </div>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div className="w-full h-full flex flex-row flex-wrap md:gap-4 gap-2 m-4 px-4">
          {categoryList?.map((category, index) => (
            <EditCategoryItem category={category} index={index}>
              {" "}
            </EditCategoryItem>
          ))}
        </div>
      )}
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Add Category</h1>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImgChange}
              className="w-full"
              required
            />
            {img && (
              <img
                src={URL.createObjectURL(img)}
                alt="Preview"
                className="mt-2 h-24 object-contain"
              />
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
