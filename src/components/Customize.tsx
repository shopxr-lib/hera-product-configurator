import React from "react";
import useStore from "../store/useStore";
import { useQuery } from "@tanstack/react-query";
import { useService } from "../lib/hooks/useService";
import { NavLink } from "react-router";
import { cn } from "../lib/utils";

type Props = object;

const heraClientId = 1;

const Customize: React.FC<Props> = () => {
  const setCustomizePopUpKey = useStore((state) => state.setCustomizePopUpKey);
  const setModal = useStore((state) => state.setModal);

  const service = useService();
  const { data } = useQuery({
    queryKey: ["product_set", { client_id: heraClientId }],
    queryFn: async () => {
      const [res, err] = await service.productSet.get({ client_id: 1 });
      if (err) {
        throw err;
      }
      return res;
    },
  });

  return (
    <div className="fixed bottom-12 flex items-center space-x-2 rounded-md bg-white p-2 sm:bottom-4 sm:left-4">
      {data?.product_sets.map((productSet) => {
        return (
          <NavLink
            key={productSet.id}
            to={`/${productSet.id}/`}
            className={({ isActive }) =>
              cn(
                "flex cursor-pointer items-center justify-center rounded-md border-2 border-transparent p-1 hover:border-gray-200",
                isActive && "border-brand hover:border-brand/80",
              )
            }
            onClick={() => {
              setModal("customize", true);
              setCustomizePopUpKey(productSet.product_set_key);
            }}
          >
            <img className="h-8" src={productSet.logo} alt={productSet.name} />
          </NavLink>
        );
      })}
    </div>
  );
};

export default Customize;
