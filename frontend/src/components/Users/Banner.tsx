import CartBanner from "../../assets/images/CartBanner.png";
const Banner = () => {
  return (
    <div className="w-full h-fit bg-primary flex flex-row items-center justify-between px-4 -mt-1">
      <h1 className="text-white text-lg font-bold">
        Find Your Daily <br></br> Grocery
      </h1>
      <img
        src={CartBanner}
        alt="cartImage"
        className="w-30 h-fit self-end "
      ></img>
    </div>
  );
};
export default Banner;
