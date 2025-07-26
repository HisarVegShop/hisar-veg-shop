import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { format } from "date-fns";

const statusLabels = ["Created", "Confirmed", "Rejected", "Delivered"];

const OrderDetail = ({ open, onClose, order }) => {
  if (!order) return null;

  let cartDetail = [];
  try {
    cartDetail = JSON.parse(order.cartdetail);
  } catch {
    cartDetail = [];
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Detail</DialogTitle>
      <DialogContent dividers>
        <div className="mb-2">
          <strong>Order ID:</strong>{" "}
          <span className="font-mono">{order._id}</span>
        </div>
        <div className="mb-2">
          <strong>Name:</strong> {order.name}
        </div>
        <div className="mb-2">
          <strong>Phone:</strong> {order.phone}
        </div>
        <div className="mb-2">
          <strong>Address:</strong> {order.address}
        </div>
        <div className="mb-2">
          <strong>Status:</strong> {statusLabels[order.status] ?? order.status}
        </div>
        <div className="mb-2">
          <strong>Date:</strong>{" "}
          {order.createdAt
            ? format(new Date(order.createdAt), "dd-MM-yyyy HH:mm:ss")
            : "-"}
        </div>
        <div className="mb-2">
          <div className="w-full flex flex-row justify-between">
            {" "}
            <strong>Cart Items</strong>{" "}
            <strong>Total : {order?.totalPrice}</strong>
          </div>
          <ul className="list-disc ml-6 mt-1">
            {cartDetail.map((item, idx) => (
              <li key={idx}>
                <div>
                  <span className="font-semibold">{item.name}</span>
                  {item.price &&
                    item.price.map((p, i) => (
                      <div
                        key={i}
                        className="mr-2 text-sm w-full flex justify-between"
                      >
                        {i + 1}. Price: ₹{p.price} {p.name} * Qty: {p.quantity}{" "}
                        <span>={(p?.price * p?.quantity || 0).toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetail;
