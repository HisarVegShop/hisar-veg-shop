import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import Contact from "../pages/Contact.tsx";
import Admin from "../pages/Admin/Admin.tsx";
import Cart from "../pages/Cart/Cart.tsx";
import UserOrderList from "../components/Users/UserOrderList.tsx";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "order", element: <UserOrderList /> },
      { path: "contact", element: <Contact /> },
      { path: "cart", element: <Cart /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
  },
];
const router = createBrowserRouter(routes);
export default router;
