import useStore from "../../store/useStore";

export const useFurnitureMap = (productSetId: number) => {
  const configs = useStore((state) => state.config);
  return configs[productSetId]?.furnitureMap;
};
