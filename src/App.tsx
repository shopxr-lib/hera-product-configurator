import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import Canvas from "./components/Canvas";
import Customize from "./components/Customize";
import CustomizePopUp from "./components/CustomizePopup2";

import ShoppingCartFloating from "./components/ShoppingCartFloating";
import { Notifications } from "@mantine/notifications";
import ShoppingCartDrawer from "./components/ShoppingCartDrawer";
import Branding from "./components/Branding";
import { Leva } from "leva";
import { Outlet } from "react-router";

function App() {
  return (
    <>
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
      <Canvas />
      <Customize />
      <CustomizePopUp />
      <ShoppingCartFloating />
      <ShoppingCartDrawer />
      <Branding />
      <Outlet />
    </>
  );
}

export default App;
