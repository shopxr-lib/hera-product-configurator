import { useQuery } from "@tanstack/react-query";
import { useService } from "../lib/hooks/useService";
import { clientId } from "../lib/constants";
import { Navigate } from "react-router";
import { LoadingOverlay } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

export default function Home(): React.ReactNode {
  const service = useService();
  const { data } = useQuery({
    queryKey: ["product_set", { client_id: clientId }],
    queryFn: async () => {
      const [res, err] = await service.productSet.get({ client_id: 1 });
      if (err) {
        throw err;
      }
      return res;
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!data.product_sets || data.product_sets.length === 0) {
      notifications.show({
        title: "No product sets found",
        message: "Please contact support",
        color: "red",
        icon: <IconX />,
        autoClose: false,
      });
    }
  }, [data]);

  if (!data) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  }

  if (!data.product_sets || data.product_sets.length === 0) {
    return null;
  }

  return <Navigate to={`/${data.product_sets[0].id}/`} />;
}
