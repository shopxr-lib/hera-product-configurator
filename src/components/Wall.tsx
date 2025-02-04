import React, { useRef } from "react";
import { type WallInfo } from "./types";
import { MeshStandardMaterial, Texture } from "three/webgpu";
import { useFrame, useThree } from "@react-three/fiber";

interface Props {
  wall: WallInfo;
  side: number; // 0 - front, 1 - back, 2 - right, 3 - left
  texture: Texture;
}

const Wall: React.FC<Props> = ({ wall, texture, side }) => {
  const ref = useRef<MeshStandardMaterial>(null);
  const { camera } = useThree();

  useFrame(() => {
    const visibleWalls = getVisibleWalls(camera.position.clone().toArray());
    // for efficiency, use ref.current to avoid re-rendering
    if (ref.current) {
      ref.current.visible = visibleWalls[side];
    }
  });

  return (
    <mesh position={wall.position} rotation={wall.rotation}>
      <boxGeometry args={wall.dimensions} />
      <meshStandardMaterial ref={ref} map={texture} />
    </mesh>
  );
};

const getVisibleWalls = (cameraPosition: [number, number, number]) => {
  const [x, , z] = cameraPosition;
  const angle = Math.atan2(x, z);

  const result = [true, true, true, true]; // All walls visible

  if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
    result[0] = false; // Front wall invisible
  } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
    result[2] = false; // Right wall invisible
  } else if (angle >= -(3 * Math.PI) / 4 && angle < -Math.PI / 4) {
    result[3] = false; // Left wall invisible
  } else {
    result[1] = false; // Back wall invisible
  }

  return result;
};

export default Wall;
