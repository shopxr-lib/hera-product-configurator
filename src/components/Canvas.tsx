import { Canvas as ThreeCanvas } from "@react-three/fiber";
import * as THREE from "three";
import Room from "./Room";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { isMobile } from "react-device-detect";
import useStore from "../store/useStore";
import { cn } from "../lib/utils";

const Canvas: React.FC = () => {
  const isCustomizeModalOpen = useStore((state) => state.modals.customize);
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
      className={cn(isCustomizeModalOpen && isMobile && "-translate-y-[30vh]")}
    >
      {/* will adjust aspect ratio automatically */}
      <PerspectiveCamera
        makeDefault
        fov={75}
        position={[0, 0.4, 0.9]}
        near={0.1}
        far={100}
        zoom={isMobile ? 0.6 : 1}
      />
      <color attach="background" args={["#C7C3C6"]} />

      <Environment files={["/hdri/bathroom.jpg"]} />

      <Room />
      <OrbitControls
        enableDamping
        rotateSpeed={0.35}
        maxPolarAngle={Math.PI / 1.5}
      />
    </ThreeCanvas>
  );
};

export default Canvas;
