import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ServiceProvider } from "./lib/context/provider.tsx";
import Home from "./pages/Home.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      theme={{
        colors: {
          brand: [
            "#a4dbd9", // Lightest
            "#92d3d1",
            "#80cbc9",
            "#6ec3c1",
            "#5cbcb9",
            "#4ab4b1",
            "#38aca9",
            "#26a4a1",
            "#149c99",
            "#029491", // Darkest
          ],
        },
        primaryColor: "brand",
      }}
    >
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <ServiceProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
            </Routes>
          </BrowserRouter>
        </ServiceProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
