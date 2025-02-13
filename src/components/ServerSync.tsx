import { useQuery } from "@tanstack/react-query";
import { useService } from "../lib/hooks/useService";
import useStore from "../store/useStore";
import { useEffect } from "react";
import { useParams } from "react-router";

const ServerSync = () => {
  const service = useService();
  const { productSetId, sessionKey } = useParams<{
    productSetId: string;
    sessionKey: string;
  }>();

  const { data } = useQuery({
    queryKey: [
      "configuration_session",
      { session_key: sessionKey, product_set_id: productSetId },
    ],
    queryFn: async () => {
      const [res, err] = await service.configurationSession.get({
        session_key: sessionKey ?? "",
        product_set_id: Number(productSetId),
      });
      if (err) {
        throw err;
      }
      return res;
    },
    enabled: Boolean(sessionKey) && Boolean(productSetId),
  });

  const setFurnitureMap = useStore((state) => state.setFurnitureMap);
  const setChoiceMap = useStore((state) => state.setChoiceMap);
  useEffect(() => {
    if (data) {
      setFurnitureMap(Number(productSetId), data.config.furnitureMap);
      setChoiceMap(Number(productSetId), data.config.choiceMap);
    }
  }, [data, setFurnitureMap, setChoiceMap, productSetId]);

  return null;
};

export default ServerSync;
