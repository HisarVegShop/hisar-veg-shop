import axiosInstance from "../../services/AxiosIntance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import ImageWithDynamicBg from "../../Utils/ImgBg.tsx";
import deleteIcon from "../../assets/delete.svg";
interface props {
  category: { _id: string; img: string; name: string };
  index: number;
}
const EditCategoryItem = ({ category, index }: props) => {
  const [img, setImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState(category.name);
  const queryClient = useQueryClient();
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id }) => {
      const formData = new FormData();
      formData.append("name", name);
      if (img) {
        formData.append("img", img);
      }
      await axiosInstance
        .patch(`/api/categories/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
      //   axiosInstance
      //     .patch(`/api/categories/${id}`, updates)
      //     .then((res) => res.data),
    },
    // optional: re-sync the cache with response
    onSuccess: () => {
      alert("Category updated successfully!");
      queryClient.invalidateQueries(["categories"]);
    
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId) =>
      axiosInstance
        .delete(`/api/categories/${categoryId}`)
        .then((res) => res.data),

    onSuccess: () => {
      // Remove category from cache
      queryClient.invalidateQueries(["categories"]);
    },
  });
  const save = (id: string) => {
    updateCategoryMutation.mutate({ id: id });
  };
  const removeCategory = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    deleteMutation.mutate(id);
  };
  return (
    <div className="md:w-90 w-[100%] flex flex-row relative justify-between items-center h-fit bg-white shadow-md shadow-gray-200 rounded-[8px] gap-2 pr-4 pl-1 py-2">
      <div className="w-fit h-20 flex justify-center items-center ">
        <ImageWithDynamicBg
          src={
            preview ? preview : import.meta.env.VITE_API_BASE_URL + category.img
          }
          className="!w-40 !h-16"
        ></ImageWithDynamicBg>
      </div>
      <div className="flex flex-col ">
        {/* File Input */}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setImg(file);
            if (file) {
              setPreview(URL.createObjectURL(file)); // show preview
            }
          }}
          className="mt-1 block w-full text-xs text-gray-900 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-xs file:font-semibold
                 file:bg-green-50 file:text-green-700
                 hover:file:bg-green-100"
        />

        {/* Name Input */}

        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-xs shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          // placeholder="Enter category name"
        />
      </div>

      <div className="flex flex-col  w-full h-full justify-between gap-5 items-end">
        <span
          className="bg-red-200 rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors duration-300"
          onClick={() => {
            removeCategory(category._id);
          }}
        >
          <img src={deleteIcon} className="w-4"></img>
        </span>
        <button
          className="w-10 bg-primary rounded-md text-white text-center text-xs px-2 py-1 hover:bg-green-600 transition-colors duration-300"
          onClick={() => {
            save(category._id);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default EditCategoryItem;
