import { useEffect, useState } from "react";
import Item from "./Item";
import OptionContainer from "./OptionContainer";
import { useSelector } from "react-redux";
export type Product = {
  _id: string;
  name: string;
  img: string;
  price: { name: string; price: number }[];
  categories: Array<{ _id: string }>;
};
interface ItemListProps {
  allProducts: Product[];
}
const ItemList = ({ allProducts }: ItemListProps) => {
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
  return (
    <div className="flex flex-row  flex-wrap items-center justify-start h-auto  bg-white w-full px-4 py-2 gap-5">
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
            <Item
              product={product}
              handleProductClick={handleProductClick}
            ></Item>
          );
      })}
      {selectedProduct ? (
        <OptionContainer
          selectedProduct={selectedProduct}
          handleProductClick={handleProductClick}
        ></OptionContainer>
      ) : (
        ""
      )}
    </div>
  );
};
export default ItemList;
