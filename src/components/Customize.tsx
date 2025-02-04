import React from "react";
import useStore from "../store/useStore";
import clsx from "clsx";

type Props = object;

const Customize: React.FC<Props> = () => {
  const setCustomizePopUpKey = useStore((state) => state.setCustomizePopUpKey);
  const setModal = useStore((state) => state.setModal);

  return (
    <div className="fixed bottom-12 flex items-center space-x-2 rounded-md bg-white p-2 sm:bottom-4 sm:left-4">
      {productIcons.map((productIcon) => {
        return (
          <button
            key={productIcon.key}
            className={clsx(
              "rounded-md border-2 border-transparent p-1 hover:border-gray-200",
            )}
            onClick={() => {
              setModal("customize", true);
              setCustomizePopUpKey(productIcon.key);
            }}
          >
            <img
              className="h-8"
              src={productIcon.src}
              alt={productIcon.label}
            />
          </button>
        );
      })}
    </div>
  );
};

const productIcons = [
  {
    key: "vanitycabinet",
    src: "images/icons/vanity-cabinet-icon.png",
    label: "Vanity Cabinet",
    minPackageTier: "enhanced",
  },
];

export default Customize;
