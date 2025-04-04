import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { IconRuler } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useService } from "./lib/hooks/useService";
import { clientId } from "./lib/constants";
import useStore from "./store/useStore";
import { cn } from "./lib/utils";
import { AuthLayout, UserLayout, NotFound, ResetPassword } from "./views/index";
import { ROUTES } from "./routing";
import { Role } from "./types";
import { useAuthContext } from "./lib/hooks/useAuthContext";
import { RouteConfig } from "./routing/types";
import { Canvas, Customize, CustomizePopUp, ShoppingCartFloating, ShoppingCartDrawer, Branding, ServerSync, ProtectedRoute } from "./components";

function App() {
  const service = useService();
  const { isAuthenticated, user } = useAuthContext();
  const [accessibleRoutes, setAccessibleRoutes] = useState<RouteConfig[] | null>(null);
  
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
  const showDimension = useStore((state) => state.showDimension);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (currentProductSetId === 0 && data.product_sets?.length) {
      setCurrentProductSetId(data.product_sets?.[0]?.id);
    }
  }, [data, setCurrentProductSetId, currentProductSetId]);

  useEffect(() => {
    if (isAuthenticated) {
      const routes = ROUTES.filter((route) => route.roles.includes(user?.role as Role));
      setAccessibleRoutes(routes as RouteConfig[]);
    }
  }, [isAuthenticated, user?.role])

  return (
    <>
      <Routes>
        <Route path="/" element={
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
        } />
        
        {/* Authentication Route */}
        <Route path="auth" element={<AuthLayout />} />
        <Route path="auth/reset-password/:token" element={<ResetPassword />} />

        {/* Authenticated Routes */}
        <Route path="user" element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }>
          {accessibleRoutes?.map((route) => (
            <Route 
              key={route.path} 
              path={route.path.replace("/user/", "")} 
              element={route.element} 
            />
          ))}
        </Route>
        {/* Catch-all for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Branding />
      <ServerSync />
    </>
  );
}

export default App;
