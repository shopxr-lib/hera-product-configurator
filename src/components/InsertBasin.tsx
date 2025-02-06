import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useStore, { FurnitureType } from "../store/useStore";

interface Props {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
}

const InsertBasin: React.FC<Props> = ({ path, ...props }) => {
  const model = useGLTF(path);
  const ref = useRef<THREE.Group>(null);

  const furnitureMap = useStore((state) => state.furnitureMap);
  const cabinet = furnitureMap[FurnitureType.VanityCabinet];
  const self = furnitureMap[FurnitureType.InsertBasin];

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const setFurnitureDimensions = useStore(
    (state) => state.setFurnitureDimensions,
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!cabinet) {
      return;
    }

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    const position: [number, number, number] = [
      cabinet.position?.[0] ?? 0,
      (cabinet.position?.[1] ?? 0) + cabinet.dimensions[1] / 2,
      cabinet.position?.[2] ?? 0,
    ];

    if (cabinet.variant?.isHybrid) {
      if (self?.variant?.insertBasinThickness === "thin") {
        position[0] += hybridThinOffsetBySize[self.size!]?.[0];
        position[1] += hybridThinOffsetBySize[self.size!]?.[1];
        position[2] += hybridThinOffsetBySize[self.size!]?.[2];
      } else if (self?.variant?.insertBasinThickness === "thick") {
        position[0] += hybridThickOffsetBySize[self.size!]?.[0];
        position[1] += hybridThickOffsetBySize[self.size!]?.[1];
        position[2] += hybridThickOffsetBySize[self.size!]?.[2];
      }
    } else {
      if (self?.variant?.insertBasinThickness === "thin") {
        position[0] += nonHybridThinOffsetBySize[self.size!]?.[0];
        position[1] += nonHybridThinOffsetBySize[self.size!]?.[1];
        position[2] += nonHybridThinOffsetBySize[self.size!]?.[2];
      } else if (self?.variant?.insertBasinThickness === "thick") {
        position[0] += nonHybridThickOffsetBySize[self.size!]?.[0];
        position[1] += nonHybridThickOffsetBySize[self.size!]?.[1];
        position[2] += nonHybridThickOffsetBySize[self.size!]?.[2];
      }
    }

    setFurniturePosition(FurnitureType.InsertBasin, position);
    setFurnitureDimensions(FurnitureType.InsertBasin, [size.x, size.y, size.z]);
  }, [
    cabinet,
    self?.size,
    self?.variant?.insertBasinThickness,
    setFurnitureDimensions,
    setFurniturePosition,
    self?.key,
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

const nonHybridThinOffsetBySize: Record<number, [number, number, number]> = {
  600: [0, -0.045, -0.04],
  800: [0, -0.052, -0.058],
};

const nonHybridThickOffsetBySize: Record<number, [number, number, number]> = {
  600: [0, -0.103, -0.035],
  800: [0, -0.11, -0.055],
};

const hybridThinOffsetBySize: Record<number, [number, number, number]> = {
  500: [0, -0.096, -0.025],
  600: [0, -0.082, -0.025],
  800: [0, -0.08, -0.03],
};

const hybridThickOffsetBySize: Record<number, [number, number, number]> = {
  500: [0, -0.047, -0.02],
  600: [0, -0.062, -0.02],
  800: [0, -0.06, -0.028],
};

export default InsertBasin;
