import { useSelector } from "react-redux";

interface props {
  product: Product;
  handleProductClick: (id: Product) => void;
}
const Item = ({ product, handleProductClick }: props) => {
  const cartItems = useSelector((state: unknown) => state.cart.items);
  const count =
    cartItems?.find((item: any) => item.id === product._id)?.totalquantity ||
    "0";
  const { name, img, price: Price } = product;
  const price = Price[0];
  return (
    <div
      className="md:w-35 w-[45%] flex flex-col relative  h-fit bg-gray-100 shadow-md shadow-gray-200 rounded-[34px] p-4 pb-7"
      onClick={() => handleProductClick(product)}
    >
      <div className="text-sm">{name}</div>
      <img
        src={import.meta.env.VITE_API_BASE_URL + img}
        className="object-contain mix-blend-multiply p-2 w-full h-20"
      ></img>
      <div className="flex-grow  h-full flex  text-gray-600 ">
        <div className="text-[0.7rem]">{`${price.price}Rs ${price.name}`}</div>
      </div>
      {/* <div className="flex flex-col"> */}
      {/* <span className="text-[0.5rem] p-0">Options</span>
        <Select
          labelId="demo-simple-select-label"
          value={age}
          onChange={handleChange}
          className="!h-5 !p-0 !m-0" // !h-9 = 36px
          sx={{
            backgroundColor: "#ffffff",
            fontSize: "0.875rem",

            height: "1.25rem", // 28px
            borderRadius: "1.7rem", // rounded-lg
            borderColor: "#d1d5db", // Tailwind gray-300
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db", // default border
              borderWidth: "1px",
              borderRadius: "1.7rem",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#9ca3af", // Tailwind gray-400
              borderWidth: "1.5px", // thicker on focus
              borderRadius: "1.7rem",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db", // Tailwind gray-300
            },
            "& .MuiSelect-select": {
              paddingY: "4px",
              paddingX: "8px",
            },
          }}
        >
          <MenuItem value={10} sx={{ height: 20, paddingY: 0 }} className="p-0">
            Ten
          </MenuItem>
        </Select>
      </div> */}

      <button className="bg-primary h-7 rounded-b-[34px] left-0  w-full absolute bottom-0 text-gray-50 cursor-pointer">
        Add
        <div className="absolute top-0 right-1 flex items-center justify-center w-6 h-6 -translate-y-[50%] text-white rounded-full  text-sm bg-black">
          {count}
        </div>
      </button>
      {/* <div className="bg-primary h-7  scale-[103%] rounded-b-[34px] left-0 w-full absolute bottom-0 text-gray-50  flex justify-center items-center  ">
        <div className="h-5 flex flex-row items-center justify-center border border-amber-300 gap-2 rounded-l-[1rem] rounded-r-[1rem] ">
          <span className="bg-amber-300 p-0 px-3 leading-tight  rounded-l-[1rem] h-5">
            -
          </span>
          <span className="text-sm  truncate">100</span>
          <span className="bg-amber-300 p-0 px-3  leading-tight rounded-r-[1rem] h-5">
            +
          </span>
        </div> */}
      {/* </div> */}
    </div>
  );
};
export default Item;
