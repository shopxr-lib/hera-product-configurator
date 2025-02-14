import { useGLTF } from "@react-three/drei";
import useStore, {
  FurnitureType,
  MaterialMap,
  TextureMap,
} from "../store/useStore";
import { useEffect, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useFurnitureMap } from "../lib/hooks/useFurnitureMap";

type Props = {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  textureMap: Partial<TextureMap>;
  materials: Partial<MaterialMap>;
  productSetId: number;
};

const OverflowRing: React.FC<Props> = ({
  materials,
  path,
  productSetId,
  ...rest
}) => {
  const { scene } = useGLTF(path);

  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const furnitureMap = useFurnitureMap(productSetId);
  const setFurniturePosition = useStore((state) => state.setFurniturePosition);

  const insertBasin = furnitureMap[FurnitureType.InsertBasin];
  const self = furnitureMap[FurnitureType.OverflowRing];

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

    const position: [number, number, number] = [0, 0, 0];

    if (insertBasin.variant?.isHybrid) {
      if (insertBasin.size && insertBasin.size in hybridOffset) {
        position[0] += hybridOffset[insertBasin.size][0];
        position[1] += hybridOffset[insertBasin.size][1];
        position[2] += hybridOffset[insertBasin.size][2];
      }
    } else {
      if (insertBasin.size && insertBasin.size in nonHybridOffset) {
        position[0] += nonHybridOffset[insertBasin.size][0];
        position[1] += nonHybridOffset[insertBasin.size][1];
        position[2] += nonHybridOffset[insertBasin.size][2];
      }
    }

    setFurniturePosition(productSetId, FurnitureType.OverflowRing, position);
  }, [insertBasin, setFurniturePosition, productSetId]);
  return <primitive object={copiedScene} position={self?.position} {...rest} />;
};

const hybridOffset: Record<number, number[]> = {
  500: [0, 0.053, -0.02],
  600: [0, 0.065, -0.02],
  800: [0, 0.067, -0.027],
};

const nonHybridOffset: Record<number, number[]> = {
  600: [0, 0.03, -0.055],
  800: [0, 0.025, -0.08],
};

export default OverflowRing;
