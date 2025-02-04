import { Select } from "@mantine/core";
import useStore from "../store/useStore";
import { packageChoices } from "./constants";

const PackagePopUpFloating: React.FC = () => {
  const selectedPackage = useStore((state) => state.package);
  const setSelectedPackage = useStore((state) => state.setPackage);
  const setDefaultFurnitureMap = useStore(
    (state) => state.setDefaultFurnitureMap,
  );
  const clearCart = useStore((state) => state.clearCart);

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="fixed left-4 top-4 w-[150px] rounded-md bg-white p-4">
      <Select
        size="xs"
        label="Package"
        data={packageChoices}
        value={selectedPackage}
        onChange={(_, option) => {
          setSelectedPackage(option.value);
          clearCart();
          setDefaultFurnitureMap();
        }}
      ></Select>
    </div>
  );
};

export default PackagePopUpFloating;
