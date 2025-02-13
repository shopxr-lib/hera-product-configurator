import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import useStore, {
  FurnitureType,
  FurnitureVariant,
  TextureMap,
} from "../store/useStore";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

type Props = {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  textureMap?: Partial<TextureMap>;
  variant?: Partial<FurnitureVariant>;
  productSetId: number;
};

const VanityCabinet = ({
  path,
  textureMap,
  variant,
  productSetId,
  ...props
}: Props) => {
  const { scene } = useGLTF(path);

  // https://github.com/pmndrs/react-three-fiber/issues/245#issuecomment-554612085
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const texture = useTexture(textureMap ?? {}, (t) => {
    Object.values(t).forEach((texture) => {
      texture.flipY = false;
    });
  });

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (Object.keys(texture).length > 0) {
          object.material.needsUpdate = true;
        }
        if (texture.map) {
          object.material.map = texture.map;
        }
      }
    });
  }, [scene, texture]);

  const ref = useRef<THREE.Group>(null);

  const furnitureMap = useStore(
    (state) => state.config[productSetId].furnitureMap,
  );
  const setFurnitureDimensions = useStore(
    (state) => state.setFurnitureDimensions,
  );
  const setFurniturePosition = useStore((state) => state.setFurniturePosition);

  const self = furnitureMap[FurnitureType.VanityCabinet];

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    setFurnitureDimensions(productSetId, FurnitureType.VanityCabinet, [
      size.x,
      size.y,
      size.z,
    ]);
    setFurniturePosition(
      productSetId,
      FurnitureType.VanityCabinet,
      [0, -0.1, 0],
    );
  }, [
    variant,
    setFurniturePosition,
    setFurnitureDimensions,
    self?.key,
    productSetId,
  ]);

  return (
    <primitive
      ref={ref}
      object={copiedScene}
      position={self?.position}
      {...props}
      {...texture}
    />
  );
};

export default VanityCabinet;
