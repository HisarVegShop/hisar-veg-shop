import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/AxiosIntance";

// Fetch all products by category
const fetchProductsByCategory = async (categoryId: string) => {
  const { data } = await axiosInstance.get(
    `/api/publish/products?category=${categoryId}`
  );
  return data;
};

export const usePublishProducts = (categoryId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["allPublishProducts"],
    queryFn: async () => {
      const newProducts = await fetchProductsByCategory(categoryId);
      queryClient.setQueryData(["allPublishProducts"], newProducts);
      return newProducts;
    },
    staleTime: 1000 * 60 * 5,
  });
};
