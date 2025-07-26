import AdminBanner from "../../components/admin/AdminBanner";
import AdminCategory from "../../components/admin/AdminCategory";
import AdminItemList from "../../components/admin/AdminItemList";
// import { useProducts } from "../../hooks/useProducts"; // Adjust the path if needed
// import Loader from "../../components/Loader";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useState } from "react";
import EditCategory from "../../components/admin/EditCategory";
import AddProduct from "../../components/admin/AddProduct";
import EditProduct from "../../components/admin/EditProduct";
import OrderList from "../../components/admin/OrderList";
const AdminCatalogPage = () => {
  const [editcategory, setEditCategory] = useState<boolean | null>(false);
  const [addProduct, setAddProduct] = useState<boolean | null>(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOrderList, setShowOrderList] = useState(false);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white ">
      <AdminNavbar setShowOrderList={setShowOrderList}></AdminNavbar>
      {editcategory ? (
        <EditCategory setEditCategory={setEditCategory}></EditCategory>
      ) : addProduct ? (
        <AddProduct setAddProduct={setAddProduct}></AddProduct>
      ) : editingProduct ? (
        <EditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      ) : showOrderList ? (
        <OrderList setShowOrderList={setShowOrderList}></OrderList>
      ) : (
        <>
          <AdminBanner></AdminBanner>
          <AdminCategory setEditCategory={setEditCategory}></AdminCategory>
          <AdminItemList
            setAddProduct={setAddProduct}
            setEditingProduct={setEditingProduct}
          ></AdminItemList>
        </>
      )}
    </div>
  );
};
export default AdminCatalogPage;
