import AdminItem from "./AdminItem";
import AdminOptionContainer from "./AdminOptionContainer";
import Loader from "../Loader";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import { useProducts } from "../../hooks/useProducts";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export type Product = {
  _id: string;
  name: string;
  img: string;
  price: { name: string; price: number }[];
  categories: Array<{ _id: string }>;
};

interface props {
  setAddProduct: React.Dispatch<React.SetStateAction<boolean | null>>;
  setEditingProduct: React.Dispatch<React.SetStateAction<null>>;
}
const AdminItemList = ({ setAddProduct, setEditingProduct }: props) => {
  const { data: allProducts = [], isLoading, error } = useProducts("");
  console.log("allProducts", allProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const handleProductClick = (id: Product | null) => {
    setSelectedProduct(id);
  };
  const selectedCategoryId = useSelector(
    (state: unknown) => state.category.selectedCategoryId
  );
  useEffect(() => {
    setSelectedProduct(null);
  }, [selectedCategoryId]);
  return isLoading ? (
    <Loader></Loader>
  ) : (
    <div className="flex flex-row  flex-wrap items-center justify-start h-auto  bg-white w-full px-4 py-2 gap-5">
      <div
        className=" md:w-35 w-[45%] pb-2  flex justify-center items-center flex-col"
        key={-1}
        onClick={() => {
          setAddProduct(true);
        }}
      >
        <div className="w-16 h-16 flex justify-center items-center ">
          <AddSharpIcon></AddSharpIcon>
        </div>
      </div>
      {allProducts?.map((product: Product) => {
        let isInCat = selectedCategoryId ? false : true;
        for (const cat of product?.categories || []) {
          if (cat._id === selectedCategoryId) {
            isInCat = true;
            break;
          }
        }
        if (isInCat)
          return (
            <AdminItem
              product={product}
              handleProductClick={handleProductClick}
              setEditingProduct={setEditingProduct}
            ></AdminItem>
          );
      })}
      {selectedProduct ? (
        <AdminOptionContainer
          selectedProduct={selectedProduct}
          handleProductClick={handleProductClick}
          setEditingProduct={setEditingProduct}
        ></AdminOptionContainer>
      ) : (
        ""
      )}
    </div>
  );
};
export default AdminItemList;
