import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice.ts";
import cartReducer from "./slices/cartSlice.ts";
const store = configureStore({
  reducer: {
    category: categoryReducer,
    cart: cartReducer,
  },
});
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("cart", JSON.stringify(state.cart.items));
  localStorage.setItem("cartTotalItems", JSON.stringify(state.cart.totalItems));
});  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
