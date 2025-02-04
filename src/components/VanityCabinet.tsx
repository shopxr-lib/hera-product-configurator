import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import useStore, {
  FurnitureType,
  FurnitureVariant,
  TextureMap,
} from "../store/useStore";
import { useEffect, useRef } from "react";
import { WALL_THICKNESS } from "./constants";

type Props = {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  textureMap?: Partial<TextureMap>;
  variant?: Partial<FurnitureVariant>;
};

const VanityCabinet = ({ path, textureMap, variant, ...props }: Props) => {
  const { scene } = useGLTF(path);
  const texture = useTexture(textureMap ?? {}, (t) => {
    Object.values(t).forEach((texture) => {
      texture.flipY = false;
    });
  });
  const roomDimension = useStore((state) => state.roomDimensions);

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

  const furnitureMap = useStore((state) => state.furnitureMap);
  const setFurnitureDimensions = useStore(
    (state) => state.setFurnitureDimensions,
  );
  const setFurniturePosition = useStore((state) => state.setFurniturePosition);

  const self = furnitureMap[FurnitureType.VanityCabinet];
  const basinFurniture = furnitureMap[FurnitureType.Basin];

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    const isHybrid = variant?.isHybrid ?? false;
    let position: [number, number, number] = [0, 0, 0];
    if (isHybrid) {
      position = [
        -roomDimension.depth / 2 + size.x / 2 + WALL_THICKNESS / 2 - 0.005,
        roomDimension.height / 4,
        roomDimension.depth / 4,
      ];
    } else if (basinFurniture) {
      position = [
        basinFurniture.position[0] + 0.01,
        basinFurniture.position[1] - size.y - 0.08,
        basinFurniture.position[2],
      ];
    }
    setFurniturePosition(FurnitureType.VanityCabinet, position);
    setFurnitureDimensions(FurnitureType.VanityCabinet, [
      size.x,
      size.y,
      size.z,
    ]);
  }, [
    variant,
    setFurniturePosition,
    setFurnitureDimensions,
    basinFurniture,
    roomDimension.depth,
    roomDimension.height,
    self?.key,
  ]);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={self?.position}
      {...props}
      {...texture}
    />
  );
};

export default VanityCabinet;
