import useStore from "../../store/useStore";

export function useChoiceMap(productSetId: number) {
  const configs = useStore((state) => state.config);
  return configs[productSetId]?.choiceMap;
}
