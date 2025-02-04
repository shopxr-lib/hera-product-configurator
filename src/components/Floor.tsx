import React from "react";
import { WALL_THICKNESS } from "./constants";
import useStore from "../store/useStore";
import { useTexture } from "@react-three/drei";

const Floor: React.FC = () => {
  const roomDimension = useStore((state) => state.roomDimensions);

  const floorTexture = useStore((state) => state.textures.floor);
  const texture = useTexture(floorTexture.maps!);

  return (
    <mesh position={[0, 0, WALL_THICKNESS / 2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[roomDimension.depth, roomDimension.length]} />
      <meshStandardMaterial
        key={floorTexture.key} // force re-render when texture changes
        {...texture}
        displacementScale={0.02}
        color={floorTexture.baseColor}
      />
    </mesh>
  );
};

export default Floor;
