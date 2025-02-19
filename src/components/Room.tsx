import useStore, {
  FurnitureType,
  VanityCabinetProductSetId,
} from "../store/useStore";
import BasinCounterTop from "./BasinCounterTop";
import { Suspense, useEffect, useRef, useState } from "react";
import VanityCabinet from "./VanityCabinet";
import Basin from "./Basin";
import InsertBasin from "./InsertBasin";
import OverflowRing from "./OverflowRing";
import Popup from "./Popup";
import Tap from "./Tap";
import Handle from "./Handle";
import Stand from "./Stand";
import * as THREE from "three";
import { Html, useHelper } from "@react-three/drei";
import { HtmlProps } from "@react-three/drei/web/Html";
import { useFurnitureMap } from "../lib/hooks/useFurnitureMap";
import { isMobile } from "react-device-detect";

const Room = () => {
  const productSetId = useStore((state) => state.currentProductSetId);
  const furnitureMap = useFurnitureMap(productSetId);

  const groupRef = useRef<THREE.Group>(null);
  const [dimensions, setDimensions] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [center, setCenter] = useState<[number, number, number]>([0, 0, 0]);
  const showDimension = useStore((state) => state.showDimension);

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const size = new THREE.Vector3();
      const boxCenter = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(boxCenter);
      setDimensions([size.x, size.y, size.z]);
      setCenter([boxCenter.x, boxCenter.y, boxCenter.z]);
    }
  }, [furnitureMap]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper(showDimension && (groupRef as any), THREE.BoxHelper, "black");

  const renderFurniture = () => {
    switch (Number(productSetId)) {
      case VanityCabinetProductSetId: {
        return (
          <group ref={groupRef}>
            {Object.values(furnitureMap).map((furniture, index) => {
              switch (furniture.type) {
                case FurnitureType.Basin:
                  return (
                    <Suspense key={furniture.key}>
                      <Basin
                        path={furniture.path}
                        textureMap={furniture.textureMap}
                        materials={furniture.materials}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );
                case FurnitureType.BasinTap:
                  return (
                    <Suspense key={furniture.key}>
                      <Tap
                        path={furniture.path}
                        materials={furniture.materials!}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );
                case FurnitureType.BasinCounterTop:
                  return (
                    <Suspense key={furniture.key}>
                      <BasinCounterTop
                        path={furniture.path}
                        textureMap={furniture.textureMap}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );
                case FurnitureType.VanityCabinet:
                  return (
                    <Suspense key={furniture.key}>
                      <VanityCabinet
                        path={furniture.path}
                        textureMap={furniture.textureMap}
                        variant={furniture.variant}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );
                case FurnitureType.InsertBasin:
                  return (
                    <Suspense key={furniture.key}>
                      <InsertBasin
                        path={furniture.path}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );
                case FurnitureType.OverflowRing:
                  return (
                    <Suspense key={furniture.key}>
                      <OverflowRing
                        path={furniture.path}
                        textureMap={furniture.textureMap!}
                        materials={furniture.materials!}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );
                case FurnitureType.Popup:
                  return (
                    <Suspense key={furniture.key}>
                      <Popup
                        path={furniture.path}
                        materials={furniture.materials!}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );

                case FurnitureType.Handle:
                  return (
                    <Suspense key={furniture.key}>
                      <Handle
                        path={furniture.path}
                        materials={furniture.materials!}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );

                case FurnitureType.Stand:
                  return (
                    <Suspense key={furniture.key}>
                      <Stand
                        path={furniture.path}
                        productSetId={Number(productSetId)}
                      />
                    </Suspense>
                  );

                default:
                  return <primitive key={index} object={furniture} />;
              }
            })}
          </group>
        );
      }
      default:
        console.warn("Product set not handled");
        return null;
    }
  };

  return (
    <>
      {productSetId > 0 && renderFurniture()}
      {showDimension && (
        <>
          {/* Width */}
          <Annotation
            position={[
              center[0] - 0.05,
              center[1] - dimensions[1] / 2 + 0.02,
              center[2] + dimensions[2] / 2,
            ]}
          >
            {`${(dimensions[0] * 100).toFixed(0)} cm`}
          </Annotation>

          {/* Height */}
          <Annotation
            position={[
              center[0] - dimensions[0] / 2 - 0.05,
              center[1],
              center[2] + dimensions[2] / 2,
            ]}
          >
            {`${(dimensions[1] * 100).toFixed(0)} cm`}
          </Annotation>

          {/* Depth */}
          <Annotation
            position={[
              center[0] - dimensions[0] / 2 - 0.05,
              center[1] - dimensions[1] / 2 + 0.1,
              center[2],
            ]}
          >
            {`${(dimensions[2] * 100).toFixed(0)} cm`}
          </Annotation>
        </>
      )}
    </>
  );
};

function Annotation({
  children,
  ...props
}: {
  children: React.ReactNode;
} & HtmlProps) {
  return (
    <Html
      {...props}
      zIndexRange={[10, 0]}
      distanceFactor={isMobile ? 1 : 2}
      style={{
        position: "relative", // set to any value other than "absolute" so that the text below is not wrapped
      }}
    >
      <div className="rounded-md bg-white p-2">{children}</div>
    </Html>
  );
}

export default Room;
