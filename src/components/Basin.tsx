import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useStore, { FurnitureType } from "../store/useStore";

interface Props {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
}

const Basin: React.FC<Props> = ({ path, ...props }) => {
  const model = useGLTF(path);
  const ref = useRef<THREE.Group>(null);

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const setFurnitureDimensions = useStore(
    (state) => state.setFurnitureDimensions,
  );

  const furnitureMap = useStore((state) => state.furnitureMap);
  const self = furnitureMap[FurnitureType.Basin];
  const cabinet = furnitureMap[FurnitureType.VanityCabinet];

  const roomDimension = useStore((state) => state.roomDimensions);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    setFurnitureDimensions(FurnitureType.Basin, [size.x, size.y, size.z]);

    const derivedPosition: [number, number, number] = [0, 0, 0];
    setFurniturePosition(FurnitureType.Basin, derivedPosition);
  }, [
    model.scene,
    roomDimension,
    setFurnitureDimensions,
    setFurniturePosition,
    cabinet?.key,
  ]);

  return (
    <primitive
      ref={ref}
      object={model.scene}
      position={self?.position}
      {...props}
    />
  );
};

export default Basin;
