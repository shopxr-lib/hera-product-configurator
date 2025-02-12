import { useMutation, useQuery } from "@tanstack/react-query";
import { useService } from "../lib/hooks/useService";
import useStore, { ChoiceMap, FurnitureMap } from "../store/useStore";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { ConfigurationSessionConfig } from "../lib/services/configuration_session";
import { useDebounceCallback } from "usehooks-ts";

const sessionKey = "aldkfalksdfj";
const productSetId = 1;

const ServerSync = () => {
  const service = useService();

  const { data } = useQuery({
    queryKey: [
      "configuration_session",
      { session_key: sessionKey, product_set_id: productSetId },
    ],
    queryFn: async () => {
      const [res, err] = await service.configurationSession.get({
        session_key: sessionKey,
        product_set_id: productSetId,
      });
      if (err) {
        throw err;
      }
      return res;
    },
  });

  const { mutate: updateConfig } = useMutation({
    mutationFn: async (config: ConfigurationSessionConfig) => {
      const err = await service.configurationSession.update({
        session_key: sessionKey,
        product_set_id: productSetId,
        config,
      });
      if (err) {
        throw err;
      }
    },
  });

  const debouncedUpdateConfig = useDebounceCallback(updateConfig, 500);

  const setFurnitureMap = useStore((state) => state.setFurnitureMap);
  const setChoiceMap = useStore((state) => state.setChoiceMap);
  useEffect(() => {
    if (data) {
      setFurnitureMap(data.config.furnitureMap);
      setChoiceMap(data.config.choiceMap);
    }
  }, [data, setFurnitureMap, setChoiceMap]);

  useEffect(() => {
    return useStore.subscribe(
      (state) => [state.furnitureMap, state.choiceMap],
      ([furnitureMap, choiceMap]) => {
        debouncedUpdateConfig({
          furnitureMap: furnitureMap as FurnitureMap,
          choiceMap: choiceMap as ChoiceMap,
        });
      },
      {
        equalityFn: shallow,
      },
    );
  });

  return null;
};

export default ServerSync;
