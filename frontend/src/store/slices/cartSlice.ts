import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<
  string,
  | {
      id: string;
      name: string;
      img: string;
      price: { name: string; price: number; quantity: string }[];
    }[]
  | number
> = {
  items: [], // Example: [{ id, name, quantity, price }]
  totalItems: 0,
};

// Load cart from localStorage
const savedCart = localStorage.getItem("cart");
const totalItems = localStorage.getItem("cartTotalItems");
if (savedCart) {
  initialState.items = JSON.parse(savedCart);
}

if (totalItems) {
  initialState.totalItems = Number(JSON.parse(totalItems));
}
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addQuantityToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.totalquantity = String(
          Number(existing.totalquantity || "0") + 1
        );
        const priceIndex = existing?.price?.findIndex(
          (p) => p.name === item.price.name
        );

        if (priceIndex >= 0) {
          existing.price[priceIndex].quantity = String(
            Number(existing.price[priceIndex].quantity || "0") + 1
          );
        } else {
          existing.price.push({ ...item.price, quantity: "1" });
        }
      } else {
        const newItem = {
          ...item,
          price: [{ ...item.price, quantity: "1" }],
          totalquantity: "1",
        };
        state.items.push(newItem);
      }
      state.totalItems = Number(state?.totalItems) + 1;
    },

    removeQuantityFromCart: (state, action) => {
      const { id, priceName } = action.payload;
      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        const priceIndex = existing.price.findIndex(
          (p) => p.name === priceName
        );
        if (priceIndex >= 0) {
          existing.totalquantity = String(Number(existing.totalquantity) - 1);
          const currentQty = Number(existing.price[priceIndex].quantity);
          if (currentQty > 1) {
            existing.price[priceIndex].quantity = String(currentQty - 1);
          } else {
            existing.price.splice(priceIndex, 1);
            if (existing.price.length === 0) {
              state.items = state.items.filter((i) => i.id !== id);
            }
          }
        }
        state.totalItems = Number(state?.totalItems) - 1;
      }
    },
    removeFromCart: (state, action) => {
      const { id, priceName } = action.payload;
      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        const priceIndex = existing.price.findIndex(
          (p) => p.name === priceName
        );
        if (priceIndex >= 0) {
          const currentQty = Number(existing.price[priceIndex].quantity);

          existing.price[priceIndex].quantity = String(0);

          existing.price.splice(priceIndex, 1);
          if (existing.price.length === 0) {
            state.items = state.items.filter((i) => i.id !== id);
          }
          state.totalItems = Number(state?.totalItems) - currentQty;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    },

    updateQuantity: (state, action) => {
      const { id, priceName, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        const priceObj = item.price.find((p) => p.name === priceName);
        if (priceObj) {
          priceObj.quantity = String(quantity);
        }
      }
    },
  },
});

export const {
  addQuantityToCart,
  removeQuantityFromCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
