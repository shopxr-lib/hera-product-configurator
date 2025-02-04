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
      cabinet.position[0],
      cabinet.position[1] + cabinet.dimensions[1] / 2,
      cabinet.position[2],
    ];

    if (self?.variant?.insertBasinThickness === "thin") {
      position[0] += thinOffsetBySize[self.size][0];
      position[1] += thinOffsetBySize[self.size][1];
    }
    if (self?.variant?.insertBasinThickness === "thick") {
      position[0] += thickOffsetBySize[self.size][0];
      position[1] += thickOffsetBySize[self.size][1];
    }

    setFurniturePosition(FurnitureType.InsertBasin, position);
    setFurnitureDimensions(FurnitureType.InsertBasin, [size.x, size.y, size.z]);
  }, [
    cabinet,
    self?.size,
    self?.variant?.insertBasinThickness,
    setFurnitureDimensions,
    setFurniturePosition,
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

const thinOffsetBySize: Record<number, [number, number, number]> = {
  500: [-0.028, -0.096, 0],
  600: [-0.026, -0.08, 0],
  800: [-0.03, -0.08, 0],
};

const thickOffsetBySize: Record<number, [number, number, number]> = {
  500: [-0.023, -0.047, 0],
  600: [-0.023, -0.06, 0],
  800: [-0.028, -0.06, 0],
};

export default InsertBasin;
