import { useState, useEffect } from "react";
import axiosInstance from "../../services/AxiosIntance";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OrderDetail from "./OrderDetail";
import OrderShareModal from "./OrderShareModal";
import {statusOptions} from "../../Utils/Constant";

const 
OrderList = ({ setShowOrderList }) => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareOrder, setShareOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/orders?date=${selectedDate}`);
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedDate]);



  
  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      await axiosInstance.patch(`/api/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-white p-4">
      <div className="relative w-full h-full flex flex-col items-center justify-center ">
        <h1 className="text-2xl  mt-2">Order List</h1>
        <div className="absolute top-2 left-0 px-4 py-1 rounded-full  flex justify-center items-center">
          <ArrowBackIcon
            sx={{ fontSize: "1.5rem" }}
            onClick={() => setShowOrderList(false)}
          ></ArrowBackIcon>
        </div>
      </div>
      <div className="mb-6 flex flex-col items-center">
        <label className="mb-1 font-medium">Select Date</label>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          size="small"
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders found for this date.</div>
      ) : (
        <div className="w-[100vw] overflow-auto">
          <table className="w-full border border-gray-200 rounded-lg ">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Address</th>
                <th className="p-2 text-left">Total Price</th>
                <th className="p-2 text-left">Status</th>
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
                    setSelectedOrder(order);
                    setDetailOpen(true);
                  }}
                >
                  <td className="p-2 font-mono text-xs">{order._id}</td>
                  <td className="p-2">{order.name}</td>
                  <td className="p-2">{order.phone}</td>
                  <td className="p-2">{order.address}</td>
                  <td className="p-2">{order.totalPrice}</td>

                  <td className="p-2">
                    <Select
                      size="small"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={!!statusUpdating[order._id]}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </td>
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
        order={selectedOrder}
      />
      <OrderShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        order={shareOrder}
      />
    </div>
  );
};

export default OrderList;
