import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import deleteIcon from "../../assets/delete.svg";
import { useDispatch } from "react-redux";
import {
  addQuantityToCart,
  removeQuantityFromCart,
  removeFromCart,
  clearCart,
} from "../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { usePublishProducts } from "../../hooks/usePublishProducts";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/AxiosIntance";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

const Cart = () => {
  const { data: products, isLoading } = usePublishProducts("");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();
  const handleAdd = (
    price: { name: string; price: string },
    id: number,
    img: string,
    name: string
  ) => {
    dispatch(
      addQuantityToCart({
        id: id,
        name: name,
        price: price,
        img: img,
      })
    );
  };
  const handleRemove = (price, id) => {
    dispatch(
      removeQuantityFromCart({
        id: id,
        priceName: price.name,
      })
    );
  };
  const handleDeleteFromCart = (price, id) => {
    dispatch(
      removeFromCart({
        id: id,
        priceName: price.name,
      })
    );
  };
  const CartpriceMapping = {};
  products?.map((product) =>
    product?.price?.map((price) => {
      CartpriceMapping[price._id] = price.price;
    })
  );

  const checkOrderMutation = useMutation({
    mutationFn: async (cartItems) => {
      // Send cart items to backend to validate prices
      const res = await axiosInstance.post("/api/orders/check", { cartItems });
      return res.data;
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (cartItems) => {
      // Send cart items to backend to create order
      const res = await axiosInstance.post("/api/orders", { cartItems });
      return res.data;
    },
  });

  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleCheckout = () => {
    setOpenOrderDialog(true);
  };

  const handleCreateOrder = async () => {
    if (!orderName || !orderPhone || !orderAddress) {
      alert("Please fill all fields.");
      return;
    }
    // Phone number validation: must be 10 digits
    if (!/^\d{10}$/.test(orderPhone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    setOrderLoading(true);
    // Prepare cart data for validation
    const cartData = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      img: item.img,
      price: item.price.map((p) => ({
        _id: p._id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
    }));
    try {
      const result = await checkOrderMutation.mutateAsync(cartData);
      if (result.valid) {
        const response = await createOrderMutation.mutateAsync({
          name: orderName,
          phone: orderPhone,
          address: orderAddress,
          totalPrice: totalPrice,
          cartdetail: JSON.stringify(cartData),
        });
        console.log("Order response:", response);
        if (response?.status === "success" && response?.order?._id) {
          setOrderId(response?.order?._id);
          setOrderSuccess(true);
          const orderIdList = JSON.parse(localStorage.getItem("orderid")) || [];
          localStorage.setItem(
            "orderid",
            JSON.stringify([...orderIdList, response?.order?._id])
          );
          localStorage.removeItem("cart");
          localStorage.removeItem("cartTotalItems");
          dispatch(clearCart());
        } else {
          alert("Failed to create order. Please try again.");
        }
      } else {
        alert("Some product prices have changed. Please review your cart.");
        reactquery.invalidateQueries(["allPublishProducts"]);
      }
    } catch (err) {
      console.error("Order validation error:", err);
      alert("Failed to validate order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems) {
      setTotalPrice(
        cartItems.reduce((total, item) => {
          return (
            total +
            item.price.reduce(
              (sum, price) =>
                sum + price.quantity * CartpriceMapping[price._id],
              0
            )
          );
        }, 0)
      );
    }
  }, [cartItems]);

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader></Loader>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-5 px-4 ">
      <div className="w-full flex-row flex justify-center relative font-medium text-2xl mb-5">
        <h3>MyCart</h3>
        <div className="absolute top-0 left-0 px-4 py-1 rounded-full bg-[#F4F4F4] flex justify-center items-center">
          <ArrowBackIcon
            sx={{ fontSize: "1.5rem" }}
            onClick={() => navigate("/home")}
          ></ArrowBackIcon>
        </div>
      </div>
      <div className="w-full h-full flex md:flex-row flex-wrap flex-col  items-center justify-start gap-2 ">
        {cartItems.map((item) => {
          return item?.price?.map((price, index) => {
            if (!CartpriceMapping) return null; // Skip if productPrice is undefined

            return (
              <div
                key={item.id + index}
                className="md:w-80 w-full flex flex-row items-stretch gap-4 py-2 px-2 rounded-2xl bg-[#F4F4F4]"
              >
                <img
                  src={import.meta.env.VITE_API_BASE_URL + item.img}
                  alt={item.name}
                  className="w-20 h-20 object-contain mix-blend-multiply"
                />
                <div className="w-full flex flex-col items-start justify-center gap-1 py-1">
                  <h4 className="text-md" style={{ fontWeight: "semiBold" }}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-600">{`₹${
                    CartpriceMapping[price?._id]
                  } ${price.name}`}</p>
                  <p className="text-md " style={{ fontWeight: "semiBold" }}>
                    ₹{price.quantity * CartpriceMapping[price?._id]}
                  </p>
                </div>
                <div className="w-full h-full flex flex-col items-end justify-between py-2 px-2 gap-5">
                  <span
                    onClick={() => {
                      handleDeleteFromCart(price, item.id);
                    }}
                  >
                    <img src={deleteIcon} className="w-4"></img>
                  </span>
                  <div className="w-full h-full flex items-end justify-end gap-2">
                    <button
                      className="w-6 h-6 flex justify-center items-center rounded-full bg-white text-sm"
                      onClick={() => handleRemove(price, item.id)}
                    >
                      -
                    </button>
                    <span className="text-sm">{price.quantity}</span>
                    <button
                      className="w-6 h-6 flex justify-center items-center rounded-full bg-[#20BD57] text-sm text-white"
                      onClick={() =>
                        handleAdd(price, item.id, item.img, item.name)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          });
        })}
        {cartItems.length === 0 && (
          <div className="w-full flex items-center justify-center text-gray-500">
            Your cart is empty
            <br />
            <span className="text-sm text-gray-400">
              Add items to your cart to see them here.
            </span>
          </div>
        )}
      </div>
      <div className="w-full h-fit absolute bottom-0 left-0 right-0 p-4 bg-[#c8c6c6] flex flex-row items-center justify-center gap-2">
        {" "}
        {cartItems.length > 0 && (
          <div className="w-full flex items-center  text-black">
            <span className="text-sm text-black font-bold">
              Total: ₹{totalPrice.toFixed(2)}
            </span>
          </div>
        )}
        <button
          className="w-full h-10 bg-[#20BD57] text-white rounded-lg"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <span className="text-sm">Proceed to Checkout</span>
        </button>
      </div>
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)}>
        {orderSuccess ? (
          <DialogContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-green-600 text-2xl font-bold mb-2">
                Order Created!
              </div>
              <div className="text-gray-700 text-lg">Your Order ID:</div>
              <div className="text-blue-700 text-xl font-mono break-all mb-4">
                {orderId}
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  // setOpenOrderDialog(false);
                  // setOrderSuccess(false);
                  // setOrderId("");
                  navigate("/home");
                }}
              >
                Close
              </button>
            </div>
          </DialogContent>
        ) : (
          <>
            <DialogTitle>Enter Order Details</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Phone Number"
                type="text"
                fullWidth
                value={orderPhone}
                onChange={(e) => setOrderPhone(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Address"
                type="text"
                fullWidth
                value={orderAddress}
                onChange={(e) => setOrderAddress(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center min-w-[120px]"
                onClick={handleCreateOrder}
                disabled={orderLoading}
              >
                {orderLoading ? <span className="loader mr-2"></span> : null}
                {orderLoading ? "Processing..." : "Create Order"}
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                onClick={() => setOpenOrderDialog(false)}
                disabled={orderLoading}
              >
                Cancel
              </button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};
export default Cart;
