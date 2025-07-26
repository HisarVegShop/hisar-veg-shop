import { useState } from "react";
import Loader from "../components/Loader";
import Banner from "../components/Users/Banner";
import Category from "../components/Users/Category";
import ItemList from "../components/Users/ItemList";
import Navbar from "../components/Users/Navbar";
import { usePublishProducts } from "../hooks/usePublishProducts";
import UserOrderList from "../components/Users/UserOrderList";

const Home = () => {
  const { data: allProducts = [], isLoading } = usePublishProducts("");
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white ">
      <Navbar></Navbar>
      <Banner></Banner>
      <Category></Category>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <ItemList allProducts={allProducts}></ItemList>
      )}
    </div>
  );
};
export default Home;
