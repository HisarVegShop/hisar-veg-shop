import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import cartIcon from "../../assets/Icons/cartIcon.svg";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/AxiosIntance";
const options = ["Option 1,allo", "Option 2,onion", "Option 3"];
interface Props {
  setShowOrderList: React.Dispatch<React.SetStateAction<boolean>>;
}
const AdminNavbar = ({ setShowOrderList }: Props) => {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);
  console.log("totalItems", totalItems);

  const handlePublish = async () => {
    // Handle publish logic here
    await axiosInstance.post("/api/publish/all");
    alert("Published successfully!");
  };

  return (
    <nav className=" w-full bg-primary px-4 py-2 sticky top-0 z-10">
      <div className="w-full flex justify-end items-center">
        {/* <div className="text-white text-lg font-bold">Admin</div>  */}
        <ul className="flex space-x-4 items-center  ">
          <li>
            <Autocomplete
              disablePortal
              options={options}
              popupIcon={<SearchIcon sx={{ fontSize: 20, color: "gray" }} />}
              sx={{
                width: 200,
                "& .MuiAutocomplete-popupIndicator": {
                  transform: "none !important", // ✅ Prevent rotation
                },
                "& .MuiAutocomplete-popupIndicatorOpen": {
                  transform: "none !important", // ✅ Prevent rotation when open
                },
                // bgcolor: "white",
                "& .MuiInputBase-root": {
                  height: 30,
                  minHeight: 30,
                  padding: 0,
                  fontSize: "0.875rem",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  bgcolor: "#fff", // Tailwind white
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db", // Tailwind gray-300
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label=""
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: "30px",
                      padding: "0 10px",
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} className="text-sm px-[10px] ">
                  {option}
                </li>
              )}
            />
          </li>
          {/* <li
            className="bg-white px-5 py-1.5 rounded-full flex items-center gap-1"
            onClick={() => navigate("/cart")}
          >
            <img src={cartIcon} className="w-4"></img>
            <span>{totalItems}</span>
          </li> */}
        </ul>
        <button
          className="ml-4 bg-red-600 text-white px-4 py-1.5 rounded-full hover:bg-red-700 transition"
          onClick={handlePublish}
        >
          Publish
        </button>

        <button
          className="ml-4 bg-gray-600 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition"
          onClick={() => {
            setShowOrderList(true);
          }}
        >
          Orders
        </button>
      </div>
    </nav>
  );
};
export default AdminNavbar;
