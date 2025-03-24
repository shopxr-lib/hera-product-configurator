import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
// import Canvas from "./components/Canvas";
// import Customize from "./components/Customize";
// import CustomizePopUp from "./components/CustomizePopup2";
// import ShoppingCartFloating from "./components/ShoppingCartFloating";
// import ShoppingCartDrawer from "./components/ShoppingCartDrawer";
import Branding from "./components/Branding";
import ServerSync from "./components/ServerSync";
import { useService } from "./lib/hooks/useService";
import { useQuery } from "@tanstack/react-query";
import { clientId } from "./lib/constants";
import { useEffect } from "react";
import useStore from "./store/useStore";
// import { IconRuler } from "@tabler/icons-react";
// import { cn } from "./lib/utils";
import { AuthLayout, LeadTracker, UserLayout } from "./views/index";
import { Route, Routes } from "react-router";

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
  // const toggleShowDimension = useStore((state) => state.toggleShowDimension);
  // const showDimension = useStore((state) => state.showDimension);

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
      <Routes>
        {/* <Route path="/" element={
          <>
            <button
            className={"absolute top-4 left-4 z-20 rounded-md bg-white p-2"}
            onClick={toggleShowDimension}
          >
            <div
              className={cn(
                "hover:border-brand/80 rounded-md border-2 border-transparent p-1",
                showDimension && "border-brand",
              )}
            >
              <IconRuler size={32} color="#868686" className="" />
            </div>
          </button>
          <Canvas />
          <Customize />
          <CustomizePopUp />
          <ShoppingCartFloating />
          <ShoppingCartDrawer />
          </>
        } /> */}
        <Route path="auth" element={<AuthLayout />} />
        <Route path="user" element={<UserLayout />}>
          <Route path="home" element={<div>Home Page</div>} />
          <Route path="tracking" element={<LeadTracker />} />
          <Route path="manage-users" element={<div>Manage Users</div>} />
        </Route>
      </Routes>
      <Branding />
      <ServerSync />
    </>
  );
}

export default App;
