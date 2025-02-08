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

const Tap: React.FC<Props> = ({ materials, path, ...rest }) => {
  const { scene } = useGLTF(path);

  const ref = useRef<THREE.Group>(null);

  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const furnitureMap = useStore((state) => state.furnitureMap);
  const insertBasin = furnitureMap[FurnitureType.InsertBasin];
  const self = furnitureMap[FurnitureType.BasinTap];

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

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    const position: [number, number, number] = [0, 0, 0];

    // counter-top

    if (self?.key.includes("8101")) {
      position[0] = 0;
      position[1] = 0.185;
      position[2] = -0.125;
    } else if (self?.key.includes("8102")) {
      position[0] = 0;
      position[1] = 0.185;
      position[2] = -0.125;
    } else if (self?.key.includes("8201")) {
      position[0] = 0;
      position[1] = 0.185;
      position[2] = -0.13;
    } else if (self?.key.includes("8202")) {
      position[0] = 0;
      position[1] = 0.185;
      position[2] = -0.125;
    } else if (self?.key.includes("8301")) {
      position[0] = 0;
      position[1] = 0.185;
      position[2] = -0.135;
    } else if (self?.key.includes("8302")) {
      position[0] = 0;
      position[1] = 0.185;
      position[2] = -0.135;
    }

    if (insertBasin) {
      if (insertBasin.variant?.isHybrid) {
        if (insertBasin.key.includes("ceramic")) {
          if (
            insertBasin.size &&
            insertBasin.size in ceramicBasinHybridOffset
          ) {
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
    }

    setFurniturePosition(FurnitureType.BasinTap, position);
  }, [insertBasin, setFurniturePosition, self?.key]);

  return (
    <primitive
      ref={ref}
      object={copiedScene}
      position={self?.position}
      {...rest}
    />
  );
};

const ceramicBasinHybridOffset: Record<number, number[]> = {
  500: [0, 0.033, 0.027],
  600: [0, 0.046, 0.025],
  800: [0, 0.048, 0.018],
};
const glassBasinHybridOffset: Record<number, number[]> = {
  500: [0, 0.002, 0.02],
  600: [0, 0.016, 0.02],
  800: [0, 0.018, 0.015],
};

const ceramicBasinOffset: Record<number, number[]> = {
  600: [0, 0.009, -0.017],
  800: [0, 0.005, -0.045],
};

const glassBasinOffset: Record<number, number[]> = {
  600: [0, 0.007, -0.04],
  800: [0, 0, -0.058],
};

export default Tap;
