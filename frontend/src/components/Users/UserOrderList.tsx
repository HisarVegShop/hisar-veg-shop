import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/AxiosIntance";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import OrderShareModal from "./OrderShareModal";
import OrderDetail from "./OrderDetail";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const UserOrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareOrder, setShareOrder] = useState(null);

  const orderIdList = localStorage.getItem("orderid");
  const orderList = orderIdList ? JSON.parse(orderIdList) : [];
  // React Query to fetch orders by list of IDs
  const {
    data: ordersData,
    isLoading: loading,
    error: ordersError,
  } = useQuery({
    queryKey: ["ordersList", orderList],
    queryFn: async () => {
      if (!orderList || orderList.length === 0) return [];
      const res = await axiosInstance.post("/api/orders/list", {
        ids: orderList,
      });
      return res.data;
    },
    enabled: !!orderList && orderList.length > 0,
  });

  // Update local state if ordersData changes
  useEffect(() => {
    if (ordersData) setOrders(ordersData);
    else setOrders([]);
  }, [ordersData]);

  return (
    <div className="w-full h-full flex flex-col items-center bg-white p-4">
      <div className="relative w-full h-full flex flex-col items-center justify-center ">
        <h1 className="text-2xl  mt-2">Order List</h1>
        <div className="absolute top-2 left-0 px-4 py-1 rounded-full  flex justify-center items-center">
          <ArrowBackIcon
            sx={{ fontSize: "1.5rem" }}
            onClick={() => navigate(-1)}
          ></ArrowBackIcon>
        </div>
      </div>
      {/* <div className="mb-6 flex flex-col items-center">
        <label className="mb-1 font-medium">Select Date</label>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          size="small"
        />
      </div> */}
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders found for this date.</div>
      ) : (
        <div className="w-[100vw] overflow-auto ">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Address</th>
                <th className="p-2 text-left">Total Price</th>
                {/* <th className="p-2 text-left">Status</th> */}
                <th className="p-2 text-left">Share</th>
                <th className="p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t"
                  onClick={() => {
                    setSelectedOrderId(order._id);
                    setDetailOpen(true);
                  }}
                >
                  <td className="p-2 font-mono text-xs">{order._id}</td>
                  <td className="p-2">{order.name}</td>
                  <td className="p-2">{order.phone}</td>
                  <td className="p-2">{order.address}</td>
                  <td className="p-2">{order.totalPrice}</td>

                  <td
                    className="p-2 text-blue-400 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareOrder(order);
                      setShareOpen(true);
                    }}
                  >
                    View
                  </td>
                  <td className="p-2 text-xs">
                    {order.createdAt
                      ? format(new Date(order?.createdAt), "HH:mm:ss")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <OrderDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        order={orders}
        loading={loading}
        error={ordersError}
      />
      <OrderShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        order={shareOrder}
      />
    </div>
  );
};

export default UserOrderList;
