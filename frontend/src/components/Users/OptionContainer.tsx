import CloseIcon from "@mui/icons-material/Close";
import type { Product } from "./ItemList";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuantityToCart,
  removeQuantityFromCart,
} from "../../store/slices/cartSlice";
const OptionContainer = ({
  selectedProduct,
  handleProductClick,
}: {
  selectedProduct: Product;
  handleProductClick: (id: Product | null) => void;
}) => {
  const { _id, name, img, price: priceList } = selectedProduct;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  console.log("cartItems", cartItems);
  const item = cartItems.find((item) => item.id === _id);
  const handleAdd = (price: { name: string; price: string }) => {
    dispatch(
      addQuantityToCart({
        id: _id,
        name: name,
        price: price,
        img: img,
      })
    );
  };
  const handleRemove = (price) => {
    dispatch(
      removeQuantityFromCart({
        id: _id,
        priceName: price.name,
      })
    );
  };
  return (
    <div
      className="fixed w-full bottom-0 left-0 h-50 bg-white border border-gray-400 py-4 pt-6  px-4 overflow-auto "
      style={{
        boxShadow: "0 -4px 6px -1px rgba(0,0,0,0.1)", // Top shadow only
      }}
    >
      <div
        className="w-fit text-end fixed bottom-50  bg-black text-white right-0 cursor-pointer"
        onClick={() => handleProductClick(null)}
      >
        <CloseIcon></CloseIcon>
      </div>
      <div className="w-full h-full flex flex-row flex-wrap md:gap-4 gap-2">
        {priceList?.map((price) => {
          const quantity =
            item?.price?.find((p) => p.name === price.name)?.quantity ?? 0;
          return (
            <div className="md:w-90 w-[100%] flex flex-row relative justify-between items-center h-fit bg-gray-100 shadow-md shadow-gray-200 rounded-[8px]  pr-4 pl-1">
              <div className="w-fit flex flex-col  items-center justify-center">
                {" "}
                {/* <div className="text-[10px] absolute top-2">Apple</div> */}
                <img
                  src={import.meta.env.VITE_API_BASE_URL + img}
                  className="object-contain mix-blend-multiply w-15 h-15"
                ></img>
              </div>

              <div className="flex-grow  h-full flex  text-gray-600 ">
                <div className="text-[0.7rem]">{`${price.price}Rs ${price.name}`}</div>
              </div>

              <div className="w-30  flex justify-center items-center  ">
                <div className="w-full h-full flex items-end justify-end gap-2">
                  <button
                    className="w-6 h-6 flex justify-center items-center rounded-full bg-white text-sm cursor-pointer"
                    onClick={() => handleRemove(price)}
                  >
                    -
                  </button>
                  <span className="text-sm">{quantity}</span>
                  <button
                    className="w-6 h-6 flex justify-center items-center rounded-full bg-[#20BD57] text-sm text-white cursor-pointer"
                    onClick={() => handleAdd(price)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OptionContainer;
