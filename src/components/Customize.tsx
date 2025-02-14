import React from "react";
import useStore from "../store/useStore";
import { useQuery } from "@tanstack/react-query";
import { useService } from "../lib/hooks/useService";
import { cn } from "../lib/utils";
import { clientId } from "../lib/constants";

type Props = object;

const Customize: React.FC<Props> = () => {
  const setCustomizePopUpKey = useStore((state) => state.setCustomizePopUpKey);
  const setModal = useStore((state) => state.setModal);

  const service = useService();
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
  const currentProductSetId = useStore((state) => state.currentProductSetId);
  const setCurrentProductSetId = useStore(
    (state) => state.setCurrentProductSetId,
  );

  return (
    <div className="fixed bottom-12 flex items-center space-x-2 rounded-md bg-white p-2 sm:bottom-4 sm:left-4">
      {data?.product_sets.map((productSet) => {
        const isActive = productSet.id === currentProductSetId;
        return (
          <button
            key={productSet.id}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-md border-2 border-transparent p-1 hover:border-gray-200",
              isActive && "border-brand hover:border-brand/80",
            )}
            onClick={() => {
              setModal("customize", true);
              setCustomizePopUpKey(productSet.product_set_key);
              setCurrentProductSetId(productSet.id);
            }}
          >
            <img className="h-8" src={productSet.logo} alt={productSet.name} />
          </button>
        );
      })}
    </div>
  );
};

export default Customize;
