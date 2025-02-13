import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import * as THREE from "three";
import useStore, { FurnitureType, type TextureMap } from "../store/useStore";

interface Props {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  textureMap?: Partial<TextureMap>;
  productSetId: number;
}

const BasinCounterTop: React.FC<Props> = ({
  path: basePath,
  textureMap,
  productSetId,
  ...props
}) => {
  const { scene } = useGLTF(basePath);

  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const texture = useTexture(textureMap!, (t) => {
    Object.values(t).forEach((texture) => {
      texture.flipY = false;
    });
  });
  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material.roughnessMap = texture.roughnessMap;
        object.material.map = texture.map;
        object.material.needsUpdate = true;
      }
    });
  }, [scene, texture]);

  const ref = useRef<THREE.Group>(null);

  const furnitureMap = useStore(
    (state) => state.config[productSetId].furnitureMap,
  );

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const setFurnitureDimensions = useStore(
    (state) => state.setFurnitureDimensions,
  );

  const cabinet = furnitureMap[FurnitureType.VanityCabinet];
  const self = furnitureMap[FurnitureType.BasinCounterTop];

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
      cabinet.position?.[0] ?? 0,
      (cabinet.position?.[1] ?? 0) + cabinet.dimensions[1] / 2,
      cabinet.position?.[2] ?? 0,
    ];
    if (self && self.size && self.size in offset) {
      const [x, y, z] = offset[self.size];
      position[0] += x;
      position[1] += y;
      position[2] += z;
    }
    setFurnitureDimensions(productSetId, FurnitureType.BasinCounterTop, [
      size.x,
      size.y,
      size.z,
    ]);
    setFurniturePosition(productSetId, FurnitureType.BasinCounterTop, position);
  }, [
    cabinet,
    self?.size,
    setFurnitureDimensions,
    setFurniturePosition,
    productSetId,
  ]);

  return (
    <primitive
      object={copiedScene}
      ref={ref}
      position={self?.position}
      {...props}
    />
  );
};

const offset: Record<number, number[]> = {
  800: [0, 0.042, -0.065],
  600: [0, 0.049, -0.042],
};

export default BasinCounterTop;
