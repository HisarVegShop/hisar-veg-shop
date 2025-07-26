import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/AxiosIntance";
import Loader from "../Loader";
import { useDispatch } from "react-redux";
import { setCategory } from "../../store/slices/categorySlice";
import ImageWithDynamicBg from "../../Utils/ImgBg.tsx";
import apple from "../../assets/images/Apple.png";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import { useSelector } from "react-redux";
import { getCategory } from "../../services/CategoryApi.ts";
interface props {
  setEditCategory: React.Dispatch<React.SetStateAction<boolean | null>>;
}
const AdminCategory = ({ setEditCategory }: props) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.category.selectedCategoryId
  );
  const { data: categoryList, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  return (
    <>
      {/* <div className="text-sm bg-white w-full h-full px-4 pt-2 "> Category</div> */}
      <div className="w-[98vw] overflow-auto flex h-fit flex-row items-center justify-start gap-2 py-4  bg-white">
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <>
            {" "}
            <div
              className={` w-20 h-20  pb-2  flex justify-center items-center flex-col ${
                selectedCategory === null
                  ? " scale-105 border-b-2 border-b-primary"
                  : ""
              }`}
              key={-1}
              onClick={() => {
                dispatch(setCategory(null));
              }}
            >
              <div className="w-16 h-16 flex justify-center items-center ">
                <ImageWithDynamicBg
                  src={apple}
                  className="w-16 h-12"
                ></ImageWithDynamicBg>
              </div>
              <div className="text-sm text-nowrap ">All Category</div>
            </div>
            {categoryList.map((category) => (
              <div
                className={` w-20 h-20  pb-2  flex justify-center items-center flex-col transition-all ease-in-out ${
                  selectedCategory === category._id
                    ? " scale-105 border-b-2 border-b-primary"
                    : ""
                }`}
                key={category.id}
                onClick={() => {
                  dispatch(setCategory(category._id));
                }}
              >
                <div className="w-16 h-16 flex justify-center items-center ">
                  <ImageWithDynamicBg
                    src={import.meta.env.VITE_API_BASE_URL + category.img}
                    className="w-16 h-12"
                  ></ImageWithDynamicBg>
                </div>
                <div className="text-sm text-nowrap  ">{category.name}</div>
              </div>
            ))}
            <div
              className="w-20 h-20  pb-2  flex justify-center items-center flex-col"
              key={-2}
              onClick={() => {
                setEditCategory(true);
              }}
            >
              <div className="w-16 h-16 flex justify-center items-center ">
                <AddSharpIcon></AddSharpIcon>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default AdminCategory;
