import axiosInstance from "./AxiosIntance";

export const getCategory = async () => {
  const { data } = await axiosInstance.get("/api/categories");
  if (!data) {
    throw new Error("Failed to fetch categories");
  }
  return data;
};
