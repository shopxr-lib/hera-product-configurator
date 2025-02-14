import { useGLTF } from "@react-three/drei";
import useStore, { FurnitureType } from "../store/useStore";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFurnitureMap } from "../lib/hooks/useFurnitureMap";

type Props = {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  productSetId: number;
};

const Stand: React.FC<Props> = ({ path, productSetId, ...rest }) => {
  const { scene } = useGLTF(path);

  const ref = useRef<THREE.Group>(null);

  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const furnitureMap = useFurnitureMap(productSetId);
  const self = furnitureMap[FurnitureType.Stand];
  const cabinet = furnitureMap[FurnitureType.VanityCabinet];

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!cabinet) {
      return;
    }

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    const position: [number, number, number] = [0, -cabinet.dimensions[1], 0];
    if (cabinet.size && cabinet.size in normalOffset) {
      position[0] += normalOffset[cabinet.size][0];
      position[1] += normalOffset[cabinet.size][1];
      position[2] += normalOffset[cabinet.size][2];
    }

    setFurniturePosition(productSetId, FurnitureType.Stand, position);
  }, [cabinet, productSetId, setFurniturePosition, self?.key]);

  // reduce very obvious flickering when cabinet is not yet loaded
  if (cabinet?.dimensions.every((d) => d === 0)) {
    return null;
  }

  return (
    <primitive
      ref={ref}
      object={copiedScene}
      position={self?.position}
      {...rest}
    />
  );
};

const normalOffset: Record<number, number[]> = {
  600: [0, -0.22, -0.04],
  800: [0, -0.22, -0.055],
};
// const hybridOffset: Record<number, number[]> = {
//   500: [-0.005, 0.065, 0.01],
//   600: [0, 0.115, -0.035],
//   800: [0, 0.115, -0.035],
// };

export default Stand;
