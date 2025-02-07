import { useGLTF } from "@react-three/drei";
import useStore, { FurnitureType, MaterialMap } from "../store/useStore";
import { useEffect, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

type Props = {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  materials: Partial<MaterialMap>;
};

const Popup: React.FC<Props> = ({ materials, path, ...rest }) => {
  const { scene } = useGLTF(path);

  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const furnitureMap = useStore((state) => state.furnitureMap);
  const insertBasin = furnitureMap[FurnitureType.InsertBasin];
  const self = furnitureMap[FurnitureType.Popup];

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
    if (!insertBasin) {
      return;
    }

    const position: [number, number, number] = [
      insertBasin.position?.[0] ?? 0,
      insertBasin.position?.[1] ?? 0,
      insertBasin.position?.[2] ?? 0,
    ];

    if (insertBasin.variant?.isHybrid) {
      if (insertBasin.key.includes("ceramic")) {
        if (insertBasin.size && insertBasin.size in ceramicBasinHybridOffset) {
          position[0] += ceramicBasinHybridOffset[insertBasin.size][0];
          position[1] += ceramicBasinHybridOffset[insertBasin.size][1];
          position[2] += ceramicBasinHybridOffset[insertBasin.size][2];
        }
      } else {
        if (insertBasin.size && insertBasin.size in glassBasinHybridOffset) {
          position[0] += glassBasinHybridOffset[insertBasin.size][0];
          position[1] += glassBasinHybridOffset[insertBasin.size][1];
          position[2] += glassBasinHybridOffset[insertBasin.size][2];
        }
      }
    } else {
      if (insertBasin.key.includes("ceramic")) {
        if (insertBasin.size && insertBasin.size in ceramicBasinOffset) {
          position[0] += ceramicBasinOffset[insertBasin.size][0];
          position[1] += ceramicBasinOffset[insertBasin.size][1];
          position[2] += ceramicBasinOffset[insertBasin.size][2];
        }
      } else {
        if (insertBasin.size && insertBasin.size in glassBasinOffset) {
          position[0] += glassBasinOffset[insertBasin.size][0];
          position[1] += glassBasinOffset[insertBasin.size][1];
          position[2] += glassBasinOffset[insertBasin.size][2];
        }
      }
    }

    setFurniturePosition(FurnitureType.Popup, position);
  }, [insertBasin, setFurniturePosition]);

  return <primitive object={copiedScene} position={self?.position} {...rest} />;
};

const ceramicBasinHybridOffset: Record<number, number[]> = {
  500: [-0.005, 0.065, 0.01],
  600: [-0.005, 0.065, 0.01],
  800: [-0.005, 0.065, 0.01],
};
const glassBasinHybridOffset: Record<number, number[]> = {
  500: [0.002, 0.0345, 0.03],
  600: [0.002, 0.0335, 0.03],
  800: [0.002, 0.0335, 0.03],
};

const ceramicBasinOffset: Record<number, number[]> = {
  600: [0, 0.013, -0.005],
  800: [0, 0.013, 0],
};

const glassBasinOffset: Record<number, number[]> = {
  600: [0, 0.02, 0],
  800: [0, 0.02, 0],
};

export default Popup;
