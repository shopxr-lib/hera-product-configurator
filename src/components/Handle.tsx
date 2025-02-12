import { useGLTF } from "@react-three/drei";
import useStore, { FurnitureType, MaterialMap } from "../store/useStore";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  materials: Partial<MaterialMap>;
};

const Handle: React.FC<Props> = ({ materials, path, ...rest }) => {
  const { scene } = useGLTF(path);

  const ref = useRef<THREE.Group>(null);

  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const furnitureMap = useStore((state) => state.config.furnitureMap);
  const self = furnitureMap[FurnitureType.Handle];
  const cabinet = furnitureMap[FurnitureType.VanityCabinet];

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material.color = new THREE.Color(materials.color);
        object.material.metalness = materials.metalness;
        object.material.roughness = materials.roughness;
        object.material.needsUpdate = true;
      }
    });
  }, [scene, materials]);
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

    const position: [number, number, number] = [
      0,
      0,
      (cabinet.position?.[2] ?? 0) + cabinet.dimensions?.[2] / 2,
    ];
    if (cabinet.variant?.isHybrid) {
      if (cabinet.size && cabinet.size in hybridOffset) {
        position[0] += hybridOffset[cabinet.size][0];
        position[1] += hybridOffset[cabinet.size][1];
        position[2] += hybridOffset[cabinet.size][2];
      }
    } else {
      if (cabinet.size && cabinet.size in normalOffset) {
        position[0] += normalOffset[cabinet.size][0];
        position[1] += normalOffset[cabinet.size][1];
        position[2] += normalOffset[cabinet.size][2];
      }
    }

    setFurniturePosition(FurnitureType.Handle, position);
  }, [cabinet, setFurniturePosition, self?.key]);

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
  600: [0, 0.11, -0.04],
  800: [0, 0.1, -0.063],
};
const hybridOffset: Record<number, number[]> = {
  500: [0, 0.1, -0.03],
  600: [0, 0.115, -0.035],
  800: [0, 0.115, -0.035],
};

export default Handle;
