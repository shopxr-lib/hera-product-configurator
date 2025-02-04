import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";

import * as THREE from "three";
import useStore, { FurnitureType } from "../store/useStore";

interface Props {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
}

const BasinTap: React.FC<Props> = ({ path: basePath, ...props }) => {
  const model = useGLTF(basePath);
  const ref = useRef<THREE.Group>(null);

  const roomDimension = useStore((state) => state.roomDimensions);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  const furnitureMap = useStore((state) => state.furnitureMap);

  let basinFurniture = furnitureMap[FurnitureType.Basin];
  if (!basinFurniture) {
    basinFurniture = furnitureMap[FurnitureType.InsertBasin];
  }

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!basinFurniture) {
      return;
    }

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    let position: [number, number, number] = [0, 0, 0];
    if (basinFurniture.type === FurnitureType.Basin) {
      position = [
        basinFurniture.position[0] -
          basinFurniture.dimensions[0] / 2 +
          size.x / 2 -
          0.04,
        basinFurniture.position[1] + basinFurniture.dimensions[1],
        basinFurniture.position[2],
      ];
    } else {
      position = [
        basinFurniture.position[0] -
          basinFurniture.dimensions[0] / 2 +
          size.x / 2 -
          0.05,
        basinFurniture.position[1] + basinFurniture.dimensions[1] + size.y / 2,
        basinFurniture.position[2],
      ];
    }
    setPosition(position);
  }, [model.scene, setPosition, roomDimension, basinFurniture]);

  return (
    <primitive ref={ref} object={model.scene} position={position} {...props} />
  );
};

export default BasinTap;
