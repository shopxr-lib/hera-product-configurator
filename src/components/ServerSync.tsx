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

  // const { mutate: updateConfig } = useMutation({
  //   mutationFn: async (config: ConfigurationSessionConfig) => {
  //     const err = await service.configurationSession.update({
  //       session_key: sessionKey,
  //       product_set_id: productSetId,
  //       config,
  //     });
  //     if (err) {
  //       throw err;
  //     }
  //   },
  // });

  // const debouncedUpdateConfig = useDebounceCallback(updateConfig, 500);

  const setFurnitureMap = useStore((state) => state.setFurnitureMap);
  const setChoiceMap = useStore((state) => state.setChoiceMap);
  useEffect(() => {
    if (data) {
      setFurnitureMap(data.config.furnitureMap);
      setChoiceMap(data.config.choiceMap);
    }
  }, [data, setFurnitureMap, setChoiceMap]);

  // useEffect(() => {
  //   return useStore.subscribe(
  //     (state) => state.config,
  //     (config) => {
  //       debouncedUpdateConfig(config);
  //     },
  //     {
  //       equalityFn: shallow,
  //     },
  //   );
  // });

  return null;
};

export default ServerSync;
