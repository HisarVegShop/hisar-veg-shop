import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import routes from "./routes/router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes freshness (products/prices don’t change too often)
      // cacheTime: 1000 * 60 * 10,       // Keep cache for 10 minutes
      refetchOnWindowFocus: true,      // Refetch if user comes back to tab (prices/stock might update)
      refetchInterval: false,           // No automatic background refetch (to save bandwidth)
      retry: 1,                        // Retry once on failure (good for flaky networks)
      refetchOnReconnect: true,        // Refetch when user regains internet
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </StrictMode>
  </QueryClientProvider>
);
