import { useQuery } from "@tanstack/react-query";
import { useService } from "../lib/hooks/useService";
import useStore from "../store/useStore";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

const ServerSync = () => {
  const service = useService();
  const [searchParams] = useSearchParams();
  const sessionKey = searchParams.get("session_key");

  const { data } = useQuery({
    queryKey: ["configuration_session", { session_key: sessionKey }],
    queryFn: async () => {
      const [res, err] = await service.configurationSession.get({
        session_key: sessionKey ?? "",
      });
      if (err) {
        console.error(err);
        throw err;
      }
      return res;
    },
    enabled: Boolean(sessionKey),
  });

  const sync = useStore((state) => state.sync);
  useEffect(() => {
    if (data) {
      sync({
        config: data.config,
        metadata: data.metadata,
      });
    }
  }, [data, sync]);

  return null;
};

export default ServerSync;
