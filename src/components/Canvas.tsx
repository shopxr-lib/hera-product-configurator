import { Canvas as ThreeCanvas } from "@react-three/fiber";
import * as THREE from "three";
import Room from "./Room";
import { Environment, OrbitControls } from "@react-three/drei";
import { isMobile } from "react-device-detect";

const Canvas: React.FC = () => {
  return (
    <ThreeCanvas
      shadows={{
        enabled: true,
        type: THREE.PCFSoftShadowMap,
      }}
      gl={{
        localClippingEnabled: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{
        position: [0, 1, 0.5],
        fov: 80,
        near: 0.001,
        far: 1000,
        zoom: isMobile ? 0.6 : 1,
      }}
    >
      <color attach="background" args={["#C7C3C6"]} />

      <Environment files={["hdri/city.hdr"]} />

      <Room />
      <OrbitControls />
    </ThreeCanvas>
  );
};

export default Canvas;
