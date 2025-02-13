import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import Canvas from "./components/Canvas";
import Customize from "./components/Customize";
import CustomizePopUp from "./components/CustomizePopup2";

import ShoppingCartFloating from "./components/ShoppingCartFloating";
import ShoppingCartDrawer from "./components/ShoppingCartDrawer";
import Branding from "./components/Branding";
import ServerSync from "./components/ServerSync";
import { Leva } from "leva";

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
      <Canvas />
      <Customize />
      <CustomizePopUp />
      <ShoppingCartFloating />
      <ShoppingCartDrawer />
      <Branding />
      <ServerSync />
    </>
  );
}

export default App;
