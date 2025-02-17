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
import { useService } from "./lib/hooks/useService";
import { useQuery } from "@tanstack/react-query";
import { clientId } from "./lib/constants";
import { useEffect } from "react";
import useStore from "./store/useStore";
import { IconRuler } from "@tabler/icons-react";

function App() {
  const service = useService();
  const setCurrentProductSetId = useStore(
    (state) => state.setCurrentProductSetId,
  );

  const currentProductSetId = useStore((state) => state.currentProductSetId);
  const { data } = useQuery({
    queryKey: ["product_set", { client_id: clientId }],
    queryFn: async () => {
      const [res, err] = await service.productSet.get({ client_id: clientId });
      if (err) {
        throw err;
      }
      return res;
    },
  });
  const toggleShowDimension = useStore((state) => state.toggleShowDimension);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (currentProductSetId === 0 && data.product_sets?.length) {
      setCurrentProductSetId(data.product_sets?.[0]?.id);
    }
  }, [data, setCurrentProductSetId, currentProductSetId]);
  return (
    <>
      <button
        className="absolute top-4 left-4 z-20 rounded-md bg-white p-2"
        onClick={toggleShowDimension}
      >
        <IconRuler size={32} color="#868686" />
      </button>
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
