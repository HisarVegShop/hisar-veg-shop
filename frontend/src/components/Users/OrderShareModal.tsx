import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useMemo } from "react";
import { statusOptions } from "../../Utils/Constant"; // Assuming this is the path to your status options
const shopkeeperContact = {
  phone: import.meta.env.VITE_API_CONTACT_NUMBER,
  email: import.meta.env.VITE_API_EMAIL,
};
const OrderShareModal = ({ open, onClose, order }) => {
  // Prepare a simple order summary message
  const shareMessage = useMemo(() => {
    let msg = `Order Details:\nOrder ID: ${order?._id}\nName: ${
      order?.name
    }\nPhone: ${order?.phone}\nAddress: ${order?.address}\nTotal: ₹${
      order?.totalPrice
    }\nStatus: ${statusOptions[order?.status]?.label}\n\nItems:\n`;
    try {
      const cart = JSON.parse(order?.cartdetail);
      cart.forEach((item, idx) => {
        msg += `${idx + 1}. ${item.name}\n`;
        if (item.price) {
          item.price.forEach((p) => {
            msg += `   -₹${p.price} ${p.name}: Qty ${p.quantity} = ${(
              p.price * p.quantity
            ).toFixed(2)} \n`;
          });
        }
      });
    } catch {}
    msg += `\nTotal Price: ₹${order?.totalPrice}`;
    msg += `\nThank you for your order!`;
    msg += `\n\nFor any queries, please contact us.`;
    msg += `\nPhone: ${shopkeeperContact.phone}`;
    msg += `\nEmail: ${shopkeeperContact.email}`;
    return msg;
  }, [order]);

  const whatsappUrl = `https://wa.me/${
    String(shopkeeperContact?.phone)?.includes("+91") ? "" : "+91"
  }${shopkeeperContact?.phone}?text=${encodeURIComponent(shareMessage)}`;

  const smsUrl = `sms:${String(shopkeeperContact?.phone)?.includes("+91") ? "" : "+91"}${
    shopkeeperContact?.phone
  }?body=${encodeURIComponent(shareMessage)}`;

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex flex-row justify-between ">Share Order
         <Button onClick={onClose} className=" text-gray-500 hover:text-gray-700">
          Close
        </Button>
      </DialogTitle>
      
      <DialogContent dividers>
        <div className="mb-2">
          <strong>Order Summary:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
            {shareMessage}
          </pre>
        </div>
      </DialogContent>
      <DialogActions>
        <div className="text-sm font-bold mr-auto pl-2">Share with ShopKeper</div>
        <Button
          component="a"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          color="success"
          variant="contained"
        >
          Share on WhatsApp
        </Button>
        <Button component="a" href={smsUrl} color="primary" variant="outlined">
          Share via SMS
        </Button>
       
      </DialogActions>
    </Dialog>
  );
};

export default OrderShareModal;
