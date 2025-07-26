import Login from "./Login";
import AdminCatalogPage from "./AdminCatalogPage";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/AxiosIntance";
const Admin = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("token");
      try {
        if (token) {
          const response = await axiosInstance.get("/api/auth/protected");
          if (response.status === 200) {
            setIsVerified(true);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    verifyAdmin();
  }, [isVerified]);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : !isVerified ? (
        <Login setIsVerified={setIsVerified}></Login>
      ) : (
        <AdminCatalogPage></AdminCatalogPage>
      )}
    </div>
  );
};
export default Admin;
