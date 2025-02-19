import { useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useStore, {
  FurnitureType,
  MaterialMap,
  TextureMap,
} from "../store/useStore";
import { useFurnitureMap } from "../lib/hooks/useFurnitureMap";

interface Props {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  textureMap?: Partial<TextureMap>;
  materials?: Partial<MaterialMap>;
  productSetId: number;
}

const Basin: React.FC<Props> = ({
  path,
  productSetId,
  materials,
  ...props
}) => {
  const { scene } = useGLTF(path);

  const copiedScene = useMemo(() => scene.clone(), [scene]);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!materials) {
      return;
    }
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material.map = null; // remove existing texture
        object.material.color = new THREE.Color(materials.color);
        object.material.metalness = materials.metalness;
        object.material.roughness = materials.roughness;
        object.material.needsUpdate = true;
      }
    });
  }, [scene, materials]);

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
      key={self?.key}
      ref={ref}
      object={copiedScene}
      position={self?.position}
      {...props}
    />
  );
};

export default Basin;
