import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/AxiosIntance";

// Fetch all products by category
const fetchProductsByCategory = async (categoryId: string) => {
  const { data } = await axiosInstance.get(
    `/api/products?category=${categoryId}`
  );
  return data;
};

export const useProducts = (categoryId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const newProducts = await fetchProductsByCategory(categoryId);
      queryClient.setQueryData(["allProducts"], newProducts);
      return newProducts;
    },
    staleTime: 1000 * 60 * 5,
  });
};
