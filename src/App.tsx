import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import Canvas from "./components/Canvas";
import Customize from "./components/Customize";
import CustomizePopUp from "./components/CustomizePopup";

import { MantineProvider } from "@mantine/core";
import PackagePopUp from "./components/PackagePopUp";
import PackageChooserFloating from "./components/PackageChooserFloating";
import ShoppingCartFloating from "./components/ShoppingCartFloating";
import { Notifications } from "@mantine/notifications";
import ShoppingCartDrawer from "./components/ShoppingCartDrawer";
import Branding from "./components/Branding";

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
      <Notifications />
      <Canvas />
      <Customize />
      <CustomizePopUp />
      <PackagePopUp />
      <PackageChooserFloating />
      <ShoppingCartFloating />
      <ShoppingCartDrawer />
      <Branding />
    </MantineProvider>
  );
}

export default App;
