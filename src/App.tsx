import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import Canvas from "./components/Canvas";
import Customize from "./components/Customize";
import CustomizePopUp from "./components/CustomizePopup2";

import { MantineProvider } from "@mantine/core";
import ShoppingCartFloating from "./components/ShoppingCartFloating";
import { Notifications } from "@mantine/notifications";
import ShoppingCartDrawer from "./components/ShoppingCartDrawer";
import Branding from "./components/Branding";
import ServerSync from "./components/ServerSync";
import { Leva } from "leva";
import { ServiceProvider } from "./lib/context/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
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
      <QueryClientProvider client={queryClient}>
        <ServiceProvider>
          <div className="absolute top-4 right-48 z-50">
            <Leva
              fill
              collapsed={false}
              hideCopyButton
              titleBar={{
                title: "Customize",
              }}
            />
          </div>
          <Notifications />
          <ServerSync />
          <Canvas />
          <Customize />
          <CustomizePopUp />
          <ShoppingCartFloating />
          <ShoppingCartDrawer />
          <Branding />
        </ServiceProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
