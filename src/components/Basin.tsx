import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useStore, { FurnitureType, TextureMap } from "../store/useStore";
import { useFurnitureMap } from "../lib/hooks/useFurnitureMap";

interface Props {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  textureMap?: Partial<TextureMap>;
  productSetId: number;
}

const Basin: React.FC<Props> = ({
  path,
  textureMap,
  productSetId,
  ...props
}) => {
  const { scene } = useGLTF(path);

  const copiedScene = useMemo(() => scene.clone(), [scene]);
  const ref = useRef<THREE.Group>(null);

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

  const setFurniturePosition = useStore((state) => state.setFurniturePosition);
  const setFurnitureDimensions = useStore(
    (state) => state.setFurnitureDimensions,
  );

  const furnitureMap = useFurnitureMap(productSetId);
  const self = furnitureMap[FurnitureType.Basin];
  const counterTop = furnitureMap[FurnitureType.BasinCounterTop];

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!counterTop) {
      return;
    }

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    setFurnitureDimensions(productSetId, FurnitureType.Basin, [
      size.x,
      size.y,
      size.z,
    ]);

    const derivedPosition: [number, number, number] = [
      counterTop.position?.[0] ?? 0,
      (counterTop.position?.[1] ?? 0) + counterTop.dimensions[1] / 2,
      (counterTop.position?.[2] ?? 0) + 0.06,
    ];
    setFurniturePosition(productSetId, FurnitureType.Basin, derivedPosition);
  }, [counterTop, productSetId, setFurnitureDimensions, setFurniturePosition]);

  return (
    <primitive
      ref={ref}
      object={copiedScene}
      position={self?.position}
      {...props}
    />
  );
};

export default Basin;
