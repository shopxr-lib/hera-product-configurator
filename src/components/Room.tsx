import useStore, { FurnitureType } from "../store/useStore";
import BasinTap from "./BasinTap";
import BasinCounterTop from "./BasinCounterTop";
import { Suspense } from "react";
import VanityCabinet from "./VanityCabinet";
import Basin from "./Basin";
import InsertBasin from "./InsertBasin";
import OverflowRing from "./OverflowRing";

const Room = () => {
  const furnitureMap = useStore((state) => state.furnitureMap);

  return (
    <group>
      {Object.values(furnitureMap).map((furniture, index) => {
        switch (furniture.type) {
          case FurnitureType.Basin:
            return (
              <Suspense key={furniture.key}>
                <Basin
                  path={furniture.path}
                  textureMap={furniture.textureMap}
                />
              </Suspense>
            );
          case FurnitureType.BasinTap:
            return (
              <Suspense key={furniture.key}>
                <BasinTap path={furniture.path} />
              </Suspense>
            );
          case FurnitureType.BasinCounterTop:
            return (
              <Suspense key={furniture.key}>
                <BasinCounterTop
                  path={furniture.path}
                  textureMap={furniture.textureMap}
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
                />
              </Suspense>
            );
          case FurnitureType.InsertBasin:
            return (
              <Suspense key={furniture.key}>
                <InsertBasin path={furniture.path} />
              </Suspense>
            );
          case FurnitureType.OverflowRing:
            return (
              <Suspense key={furniture.key}>
                <OverflowRing
                  path={furniture.path}
                  textureMap={furniture.textureMap!}
                  materials={furniture.materials!}
                />
              </Suspense>
            );
          default:
            return <primitive key={index} object={furniture} />;
        }
      })}
    </group>
  );
};

export default Room;
