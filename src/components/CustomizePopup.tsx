import React, { useState } from "react";
import clsx from "clsx";
import useStore from "../store/useStore";
import { Button, Modal, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { cn } from "../lib/utils";

const CustomizePopUp: React.FC = () => {
  const customizePopUpKey = useStore((state) => state.customizePopUpKey);
  const customizeSelected = useStore((state) => state.customizeSelected);
  const clearCustomizeSelected = useStore(
    (state) => state.clearCustomizeSelected,
  );
  const opened = useStore((state) => state.modals.customize);
  const setModal = useStore((state) => state.setModal);

  const addCustomizeSelected = useStore((state) => state.addCustomizeSelected);
  const commitCustomizeSelected = useStore(
    (state) => state.commitCustomizeSelected,
  );

  const customizeSelectedLevelKeys = useStore(
    (state) => state.customizeSelectedLevelKeys,
  );
  const addCustomizeSelectedLevelKey = useStore(
    (state) => state.addCustomizeSelectedLevelKeys,
  );

  const [step, setStep] = useState(0);

  const popUpInfo = PopUpInfos[customizePopUpKey];
  if (!popUpInfo) {
    return null;
  }

  const handleClose = () => {
    setModal("customize", false);
    clearCustomizeSelected();
    setStep(0);
  };

  const renderLevel = (
    levelStruct: DependentLevel | IndependentLevel,
    level: number,
  ) => {
    if (isDependentLevel(levelStruct)) {
      if (!(customizeSelectedLevelKeys[level - 2] in levelStruct.items)) {
        return null;
      }

      return (
        <div className="flex flex-col gap-4">
          <Title order={3}>
            {levelStruct.items[customizeSelectedLevelKeys[level - 2]].title}
          </Title>
          <div
            className={cn(
              "items-center justify-items-center gap-4",
              levelStruct.items[customizeSelectedLevelKeys[level - 2]].choices
                .length <= 2
                ? "flex"
                : "grid grid-cols-3",
            )}
          >
            {levelStruct.items[
              customizeSelectedLevelKeys[level - 2]
            ].choices.map((choice) => {
              const choiceKey = choice.productKey ?? choice.key;
              const selected = customizeSelected[level - 1] === choiceKey;

              const currentRecord =
                levelStruct.items[customizeSelectedLevelKeys[level - 2]];

              return (
                <button
                  key={choice.key}
                  className={clsx(
                    "flex h-full min-h-min w-full flex-col items-center justify-between rounded-md border-4 p-2",
                    {
                      "border-brand": selected,
                      "border-transparent hover:border-gray-300": !selected,
                    },
                  )}
                  onClick={() => {
                    addCustomizeSelected(choiceKey, level - 1);

                    let nextKey =
                      choice.computeNextLevelKey?.(
                        customizeSelectedLevelKeys,
                      ) ?? choice.nextLevelKey;

                    if (!nextKey) {
                      nextKey =
                        currentRecord.computeNextLevelKey?.(
                          customizeSelectedLevelKeys,
                        ) ?? currentRecord.nextLevelKey;
                    }

                    if (!nextKey) {
                      nextKey = choiceKey;
                    }

                    addCustomizeSelectedLevelKey(nextKey, level - 1);
                    setStep(Math.max(step, level));
                  }}
                >
                  {choice.image ? (
                    <div className="relative w-full pb-[100%]">
                      <img
                        className="absolute top-0 left-0 h-full w-full object-cover"
                        src={choice.image}
                        alt={choice.title}
                      />
                    </div>
                  ) : (
                    choice.title
                  )}
                  {choice.title && choice.image && (
                    <Text size="sm">{choice.title}</Text>
                  )}
                  {choice.subtitle && (
                    <Text size="xs" c="dimmed">
                      {choice.subtitle}
                    </Text>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return levelStruct.items.map((item) => (
      <div key={item.title} className="flex flex-col gap-4">
        <Title order={3}>{item.title}</Title>
        <div className="flex gap-4">
          {item.choices.map((choice) => {
            if (choice.hideIf?.(customizeSelectedLevelKeys)) {
              return null;
            }

            const selected = customizeSelected[level - 1] === choice.key;
            return (
              <button
                key={choice.key}
                className={clsx(
                  "flex h-fit min-h-min w-full flex-col items-center justify-between rounded-md border-4 p-2",
                  {
                    "border-brand": selected,
                    "border-transparent hover:border-gray-300": !selected,
                  },
                )}
                onClick={() => {
                  const choiceKey = choice.key;
                  addCustomizeSelected(choiceKey, level - 1);

                  const nextKey =
                    choice.computeNextLevelKey?.(customizeSelectedLevelKeys) ??
                    choice.nextLevelKey ??
                    choice.key;

                  addCustomizeSelectedLevelKey(nextKey, level - 1);

                  setStep(Math.max(step, level));
                }}
              >
                {choice.image ? (
                  <div className="relative w-full pb-[100%]">
                    <img
                      className="absolute top-0 left-0 h-full w-full object-cover"
                      src={choice.image}
                      alt={choice.title}
                    />
                  </div>
                ) : (
                  choice.title
                )}
              </button>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<p className="text-3xl font-bold">{popUpInfo.title}</p>}
      centered
      classNames={{
        content: "sm:left-4 sm:absolute sm:w-[600px]",
      }}
    >
      <div className="flex flex-col gap-8">
        <Text>{popUpInfo.subtitle}</Text>
        {renderLevel(popUpInfo.l1, 1)}
        {step >= 1 && popUpInfo.l2 && renderLevel(popUpInfo.l2, 2)}
        {step >= 2 && popUpInfo.l3 && renderLevel(popUpInfo.l3, 3)}
        {step >= 3 && popUpInfo.l4 && renderLevel(popUpInfo.l4, 4)}
        {step >= 4 && popUpInfo.l5 && renderLevel(popUpInfo.l5, 5)}
        {step >= 5 && popUpInfo.l6 && renderLevel(popUpInfo.l6, 6)}
        {step >= 6 && popUpInfo.l7 && renderLevel(popUpInfo.l7, 7)}

        {step >= popUpInfo.maxStep - 1 && (
          <Button
            onClick={() => {
              commitCustomizeSelected();
              notifications.show({
                title: "Success",
                message: "Your changes have been saved",
                position: "top-center",
              });
              handleClose();
            }}
            disabled={customizeSelected.length < popUpInfo.maxStep}
          >
            {popUpInfo.buttonText ?? "Save"}
          </Button>
        )}
      </div>
    </Modal>
  );
};

const vanityCabinetDimensionsText = {
  "600": "W:60 x H:45 x D:46 cm",
  "800": "W:80 x H:45 x D:46 cm",
};

const vanityCabinetHybridDimensionsText = {
  "500": "W:50 x H:45 x D:40 cm",
  "600": "W:60 x H:45 x D:40 cm",
  "800": "W:80 x H:45 x D:40 cm",
};

const countertopDimensionsText = {
  "600": "W:60 x H:1 x D:46 cm",
  "800": "W:80 x H:1 x D:46 cm",
};

const insertBasinDimensionsText = {
  "500": {
    ceramic: "W:51 x H:16 x D:40 cm",
    glass: "W:51 x H:15 x D:40 cm",
  },
  "600": {
    ceramic: "W:60 x H:16 x D:40 cm",
    glass: "W:60 x H:15 x D:40 cm",
  },
  "800": {
    ceramic: "W:80 x H:16 x D:40 cm",
    glass: "W:80 x H:15 x D:40 cm",
  },
};

const basinDimensionsText = {
  rectangular: "W:46 x H:13 x D:32 cm",
  round: "W:36 x H:12 x D:36 cm",
};

const PopUpInfos: Record<string, PopUpInfo> = {
  wallpaper: {
    title: "Wallpaper",
    subtitle: "Choose a wallpaper for your bathroom",
    buttonText: "Save",
    maxStep: 2,
    l1: {
      items: [
        {
          title: "Surface",
          choices: [
            {
              key: "wall",
              title: "Wall",
            },
            {
              key: "ceiling",
              title: "Ceiling",
            },
            {
              key: "floor",
              title: "Floor",
            },
          ],
        },
      ],
    },
    l2: {
      items: {
        ceiling: {
          parent: "ceiling",
          title: "Ceiling",
          choices: [
            {
              key: "default",
              image: "images/wallpaper/bto-ceiling-texture.webp",
              productKey: "default",
            },
          ],
        },
        wall: {
          parent: "wall",
          title: "Wall",
          choices: [
            {
              key: "marble",
              productKey: "marble",
              image: "images/wallpaper/marble-wall.webp",
            },
            {
              key: "stuco-plaster",
              productKey: "stuco-plaster",
              image: "images/wallpaper/stuco-plaster-wall.jpg",
            },
          ],
        },
        floor: {
          parent: "floor",
          title: "Floor",
          choices: [
            {
              key: "base-color",
              productKey: "base-color",
              image: "images/wallpaper/bto-floorTile-BaseColor.webp",
            },
            {
              key: "white-stone",
              productKey: "white-stone",
              image: "images/wallpaper/floor-whitestone.jpg",
            },
          ],
        },
      },
    },
  },
  vanitycabinet: {
    title: "Vanity Cabinet Set",
    subtitle:
      "Mix & Match your very own vanity cabinet set & add it into the scene.",
    buttonText: "Add Furniture",
    maxStep: 10,
    l1: {
      items: [
        {
          title: "Breadth",
          choices: [
            {
              key: "breadth-40",
              title: "40cm",
            },
            {
              key: "breadth-46",
              title: "46cm",
            },
          ],
        },
      ],
    },
    l2: {
      items: {
        "breadth-40": {
          parent: "breadth-40",
          title: "Width",
          choices: [
            {
              key: "width-50",
              title: "50cm",
              nextLevelKey: "breadth-40:width-50",
            },
            {
              key: "width-60",
              title: "60cm",
              nextLevelKey: "breadth-40:width-60",
            },
            {
              key: "width-80",
              title: "80cm",
              nextLevelKey: "breadth-40:width-80",
            },
          ],
        },
        "breadth-46": {
          parent: "breadth-46",
          title: "Width",
          choices: [
            {
              key: "width-60",
              title: "60cm",
              nextLevelKey: "breadth-46:width-60",
            },
            {
              key: "width-80",
              title: "80cm",
              nextLevelKey: "breadth-46:width-80",
            },
          ],
        },
      },
    },
    l3: {
      items: {
        "breadth-40:width-50": {
          parent: "breadth-40:width-50",
          title: "Color",
          choices: [
            {
              key: "vanity-cabinet-hybrid-pebble-500mm",
              title: "Hybrid Pebble",
              subtitle: vanityCabinetHybridDimensionsText["500"],
              productKey: "hybrid-pebble",
              image: "images/vanity-cabinet/hybrid-pebble-500mm.webp",
            },
            {
              key: "vanity-cabinet-hybrid-pine-500mm",
              title: "Hybrid Pine",
              subtitle: vanityCabinetHybridDimensionsText["500"],
              productKey: "hybrid-pine",
              image: "images/vanity-cabinet/hybrid-pine-500mm.webp",
            },
            {
              key: "vanity-cabinet-hybrid-walnut-500mm",
              title: "Hybrid Walnut",
              subtitle: vanityCabinetHybridDimensionsText["500"],
              productKey: "hybrid-walnut",
              image: "images/vanity-cabinet/hybrid-walnut-500mm.webp",
            },
          ],
        },
        "breadth-40:width-60": {
          parent: "breadth-40:width-60",
          title: "Color",
          choices: [
            {
              key: "vanity-hybrid-pebble-600mm",
              productKey: "hybrid-pebble",
              title: "Hybrid Pebble",
              subtitle: vanityCabinetHybridDimensionsText["600"],
              image: "images/vanity-cabinet/hybrid-pebble-600mm.webp",
              // nextLevelKey: "600-hybrid",
            },
            {
              key: "vanity-hybrid-pine-600mm",
              productKey: "hybrid-pine",
              title: "Hybrid Pine",
              subtitle: vanityCabinetHybridDimensionsText["600"],
              image: "images/vanity-cabinet/hybrid-pine-600mm.webp",
              // nextLevelKey: "600-hybrid",
            },
            {
              key: "vanity-hybrid-walnut-600mm",
              productKey: "hybrid-walnut",
              title: "Hybrid Walnut",
              subtitle: vanityCabinetHybridDimensionsText["600"],
              image: "images/vanity-cabinet/hybrid-walnut-600mm.webp",
              // nextLevelKey: "600-hybrid",
            },
          ],
        },
        "breadth-40:width-80": {
          parent: "breadth-40:width-80",
          title: "Color",
          choices: [
            {
              key: "vanity-hybrid-pebble-800mm",
              productKey: "hybrid-pebble",
              title: "Hybrid Pebble",
              subtitle: vanityCabinetHybridDimensionsText["800"],
              image: "images/vanity-cabinet/hybrid-pebble-800mm.webp",
            },
            {
              key: "vanity-hybrid-pine-800mm",
              productKey: "hybrid-pine",
              title: "Hybrid Pine",
              subtitle: vanityCabinetHybridDimensionsText["800"],
              image: "images/vanity-cabinet/hybrid-pine-800mm.webp",
            },
            {
              key: "vanity-hybrid-walnut-800mm",
              productKey: "hybrid-walnut",
              title: "Hybrid Walnut",
              subtitle: vanityCabinetHybridDimensionsText["800"],
              image: "images/vanity-cabinet/hybrid-walnut-800mm.webp",
            },
          ],
        },
        "breadth-46:width-60": {
          parent: "breadth-46-width-60",
          title: "Color",
          choices: [
            {
              key: "vanity-birch-600mm",
              productKey: "birch",
              title: "Birch",
              subtitle: vanityCabinetDimensionsText["600"],
              image: "images/vanity-cabinet/birch-600mm.webp",
            },
            {
              key: "vanity-blanco-600mm",
              productKey: "blanco",
              title: "Blanco",
              subtitle: vanityCabinetDimensionsText["600"],
              image: "images/vanity-cabinet/blanco-600mm.webp",
            },
            {
              key: "vanity-brownstone-600mm",
              productKey: "brown-stone",
              title: "Brownstone",
              subtitle: vanityCabinetDimensionsText["600"],
              image: "images/vanity-cabinet/brownstone-600mm.webp",
            },
            {
              key: "vanity-charcoal-ash-600mm",
              productKey: "charcoal-ash",
              title: "Charcoal Ash",
              subtitle: vanityCabinetDimensionsText["600"],
              image: "images/vanity-cabinet/charcoal-ash-600mm.webp",
            },
            {
              key: "vanity-graphite-600mm",
              productKey: "graphite",
              title: "Graphite",
              subtitle: vanityCabinetDimensionsText["600"],
              image: "images/vanity-cabinet/graphite-600mm.webp",
            },
            {
              key: "vanity-matt-black-600mm",
              productKey: "matt-black",
              title: "Matt Black",
              subtitle: vanityCabinetDimensionsText["600"],
              image: "images/vanity-cabinet/matt-black-600mm.webp",
            },
            {
              key: "vanity-oakwood-600mm",
              productKey: "oakwood",
              title: "Oakwood",
              subtitle: vanityCabinetDimensionsText["600"],
              image: "images/vanity-cabinet/oakwood-600mm.webp",
            },
          ],
        },
        "breadth-46:width-80": {
          parent: "breadth-46-width-80",
          title: "Color",
          choices: [
            {
              key: "vanity-birch-800mm",
              productKey: "birch",
              title: "Birch",
              subtitle: vanityCabinetDimensionsText["800"],
              image: "images/vanity-cabinet/birch-800mm.webp",
            },
            {
              key: "vanity-blanco-800mm",
              productKey: "blanco",
              title: "Blanco",
              subtitle: vanityCabinetDimensionsText["800"],
              image: "images/vanity-cabinet/blanco-800mm.webp",
            },
            {
              key: "vanity-brownstone-800mm",
              productKey: "brown-stone",
              title: "Brownstone",
              subtitle: vanityCabinetDimensionsText["800"],
              image: "images/vanity-cabinet/brownstone-800mm.webp",
            },
            {
              key: "vanity-charcoal-ash-800mm",
              productKey: "charcoal-ash",
              title: "Charcoal",
              subtitle: vanityCabinetDimensionsText["800"],
              image: "images/vanity-cabinet/charcoal-ash-800mm.webp",
            },
            {
              key: "vanity-graphite-800mm",
              productKey: "graphite",
              title: "Graphite",
              subtitle: vanityCabinetDimensionsText["800"],
              image: "images/vanity-cabinet/graphite-800mm.webp",
            },
            {
              key: "vanity-matt-black-800mm",
              productKey: "matt-black",
              title: "Matt Black",
              subtitle: vanityCabinetDimensionsText["800"],
              image: "images/vanity-cabinet/matt-black-800mm.webp",
            },
            {
              key: "vanity-oakwood-800mm",
              productKey: "oakwood",
              title: "Oakwood",
              subtitle: vanityCabinetDimensionsText["800"],
              image: "images/vanity-cabinet/oakwood-800mm.webp",
            },
          ],
        },
      },
    },
    l4: {
      items: [
        {
          title: "Select Top",
          choices: [
            {
              key: "insert-basin",
              title: "Insert Basin",
              computeNextLevelKey(keys) {
                const segments = keys[1].split(":"); // get width
                return `insert-basin-${segments[1]}`;
              },
            },
            {
              key: "counter-top",
              title: "Counter Top",
              computeNextLevelKey(keys) {
                const segments = keys[1].split(":"); // get width
                return `counter-top-${segments[1]}`;
              },
              hideIf(keys) {
                if (keys.length < 1) {
                  return true;
                }
                return !keys[0].includes("breadth-46");
              },
            },
          ],
        },
      ],
    },
    l5: {
      items: {
        "insert-basin-width-50": {
          parent: "insert-basin-width-50",
          title: "Insert Basin",
          nextLevelKey: "basin-overflow-ring",
          choices: [
            {
              key: "insert-basin-ceramic-500mm",
              productKey: "insert-basin-ceramic",
              title: "White Ceramic",
              subtitle: insertBasinDimensionsText["500"].ceramic,
              image: "images/insert-basin/ceramic-helios.webp",
            },
            {
              key: "insert-basin-glass-black-500mm",
              productKey: "insert-basin-glass-black",
              title: "Black Glass",
              subtitle: insertBasinDimensionsText["500"].glass,
              image: "images/insert-basin/glass-black.webp",
            },
            {
              key: "insert-basin-glass-white-500mm",
              productKey: "insert-basin-glass-white",
              title: "White Glass",
              subtitle: insertBasinDimensionsText["500"].glass,
              image: "images/insert-basin/glass-white.webp",
            },
          ],
        },
        "insert-basin-width-60": {
          parent: "insert-basin-width-60",
          title: "Insert Basin",
          nextLevelKey: "basin-overflow-ring",
          choices: [
            {
              key: "insert-basin-ceramic-600mm",
              productKey: "insert-basin-ceramic",
              title: "White Ceramic",
              subtitle: insertBasinDimensionsText["600"].ceramic,
              image: "images/insert-basin/ceramic-helios.webp",
            },
            {
              key: "insert-basin-glass-black-600mm",
              productKey: "insert-basin-glass-black",
              title: "Black Glass",
              subtitle: insertBasinDimensionsText["600"].glass,
              image: "images/insert-basin/glass-black.webp",
            },
            {
              key: "insert-basin-glass-white-600mm",
              productKey: "insert-basin-glass-white",
              title: "White Glass",
              subtitle: insertBasinDimensionsText["600"].glass,
              image: "images/insert-basin/glass-white.webp",
            },
          ],
        },
        "insert-basin-width-80": {
          parent: "insert-basin-width-80",
          title: "Insert Basin",
          nextLevelKey: "basin-overflow-ring",
          choices: [
            {
              key: "insert-basin-ceramic-800mm",
              productKey: "insert-basin-ceramic",
              title: "White Ceramic",
              subtitle: insertBasinDimensionsText["800"].ceramic,
              image: "images/insert-basin/ceramic-helios.webp",
            },
            {
              key: "insert-basin-glass-black-800mm",
              productKey: "insert-basin-glass-black",
              title: "Black Glass",
              subtitle: insertBasinDimensionsText["800"].glass,
              image: "images/insert-basin/glass-black.webp",
            },
            {
              key: "insert-basin-glass-white-800mm",
              productKey: "insert-basin-glass-white",
              title: "White Glass",
              subtitle: insertBasinDimensionsText["800"].glass,
              image: "images/insert-basin/glass-white.webp",
            },
          ],
        },
        "counter-top-width-60": {
          title: "Counter Top",
          parent: "counter-top-width-60",
          nextLevelKey: "basin",
          choices: [
            {
              key: "counter-top-birch-600mm",
              productKey: "counter-top-birch",
              title: "Birch",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-birch.webp",
            },
            {
              key: "counter-top-brownstone-600mm",
              productKey: "counter-top-brownstone",
              title: "Brownstone",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-brownstone.webp",
            },
            {
              key: "counter-top-charcoal-ash-600mm",
              productKey: "counter-top-charcoal-ash",
              title: "Charcoal Ash",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-charcoal-ash.webp",
            },
            {
              key: "counter-top-oakwood-600mm",
              productKey: "counter-top-oakwood",
              title: "Oakwood",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-oakwood.webp",
            },
            {
              key: "counter-top-black-600mm",
              productKey: "counter-top-black",
              title: "Black Quartz",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-black.webp",
            },
            {
              key: "counter-top-white-600mm",
              productKey: "counter-top-white",
              title: "White Quartz",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-white.webp",
            },
          ],
        },
        "counter-top-width-80": {
          parent: "800",
          title: "Counter Top",
          nextLevelKey: "basin",
          choices: [
            {
              key: "counter-top-birch-800mm",
              productKey: "counter-top-birch",
              title: "Birch",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-birch.webp",
            },
            {
              key: "counter-top-brownstone-800mm",
              productKey: "counter-top-brownstone",
              title: "Brownstone",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-brownstone.webp",
            },
            {
              key: "counter-top-charcoal-ash-800mm",
              productKey: "counter-top-charcoal-ash",
              title: "Charcoal Ash",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-charcoal-ash.webp",
            },
            {
              key: "counter-top-oakwood-800mm",
              productKey: "counter-top-oakwood",
              title: "Oakwood",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-oakwood.webp",
            },
            {
              key: "counter-top-black-800mm",
              productKey: "counter-top-black",
              title: "Black Quartz",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-black.webp",
            },
            {
              key: "counter-top-white-800mm",
              productKey: "counter-top-white",
              title: "White Quartz",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-white.webp",
            },
          ],
        },
      },
    },
    l6: {
      items: {
        "basin-overflow-ring": {
          title: "Basin Overflow Ring",
          parent: "basin-overflow-ring",
          nextLevelKey: "popup",
          choices: [
            {
              key: "basin-overlow-ring-chrome",
              productKey: "basin-overflow-ring-chrome",
              title: "Chrome",
              image:
                "images/basin-overflow-ring/basin-overflow-ring-chrome.webp",
            },
            {
              key: "basin-overlow-ring-gold",
              productKey: "basin-overflow-ring-gold",
              title: "Gold",
              image: "images/basin-overflow-ring/basin-overflow-ring-gold.webp",
            },
            {
              key: "basin-overflow-ring-gun-metal",
              productKey: "basin-overflow-ring-gun-metal",
              title: "Gun Metal",
              image:
                "images/basin-overflow-ring/basin-overflow-ring-gun-metal.webp",
            },
            {
              key: "basin-overflow-ring-matt-black",
              productKey: "basin-overflow-ring-matt-black",
              title: "Matt Black",
              image:
                "images/basin-overflow-ring/basin-overflow-ring-matt-black.webp",
            },
            {
              key: "basin-overflow-ring-rose-gold",
              productKey: "basin-overflow-ring-rose-gold",
              title: "Rose Gold",
              image:
                "images/basin-overflow-ring/basin-overflow-ring-rose-gold.webp",
            },
          ],
        },
        basin: {
          parent: "basin",
          title: "Basin Options",
          choices: [
            {
              key: "basin-rectangular-ceramic-blush",
              productKey: "basin-rectangular-ceramic-blush",
              title: "Blush Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image: "images/basin/hera-rectangular-ceramic-basin-blush.webp",
            },
            {
              key: "basin-rectangular-ceramic-eclair",
              productKey: "basin-rectangular-ceramic-eclair",
              title: "Eclair Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image: "images/basin/hera-rectangular-ceramic-basin-eclair.webp",
            },
            {
              key: "basin-rectangular-ceramic-matt-black",
              productKey: "basin-rectangular-ceramic-matt-black",
              title: "Matt Black Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image:
                "images/basin/hera-rectangular-ceramic-basin-matt-black.webp",
            },
            {
              key: "basin-rectangular-ceramic-matt-white",
              productKey: "basin-rectangular-ceramic-matt-white",
              title: "Matt White Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image:
                "images/basin/hera-rectangular-ceramic-basin-matt-white.webp",
            },
            {
              key: "basin-rectangular-ceramic-mocha",
              productKey: "basin-rectangular-ceramic-mocha",
              title: "Mocha Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image: "images/basin/hera-rectangular-ceramic-basin-mocha.webp",
            },
            {
              key: "basin-rectangular-ceramic-moss",
              productKey: "basin-rectangular-ceramic-moss",
              title: "Moss Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image: "images/basin/hera-rectangular-ceramic-basin-moss.webp",
            },
            {
              key: "basin-rectangular-ceramic-slate-grey",
              productKey: "basin-rectangular-ceramic-slate-grey",
              title: "Slate Grey Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image:
                "images/basin/hera-rectangular-ceramic-basin-slate-grey.webp",
            },
            {
              key: "basin-rectangular-ceramic-storm",
              productKey: "basin-rectangular-ceramic-storm",
              title: "Storm Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image: "images/basin/hera-rectangular-ceramic-basin-storm.webp",
            },
            {
              key: "basin-rectangular-ceramic-teal",
              productKey: "basin-rectangular-ceramic-teal",
              title: "Teal Rectangular Ceramic",
              subtitle: basinDimensionsText.rectangular,
              image: "images/basin/hera-rectangular-ceramic-basin-teal.webp",
            },
            {
              key: "basin-round-ceramic-blush",
              productKey: "basin-round-ceramic-blush",
              title: "Blush Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-blush.webp",
            },
            {
              key: "basin-round-matt-black",
              productKey: "basin-round-matt-black",
              title: "Matt Black Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-matt-black.webp",
            },
            {
              key: "basin-round-matt-white",
              productKey: "basin-round-matt-white",
              title: "Matt White Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-matt-white.webp",
            },
            {
              key: "basin-round-mint",
              productKey: "basin-round-mint",
              title: "Mint Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-mint.webp",
            },
            {
              key: "basin-round-mocha",
              productKey: "basin-round-mocha",
              title: "Mocha Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-mocha.webp",
            },
            {
              key: "basin-round-slate-grey",
              productKey: "basin-round-slate-grey",
              title: "Slate Grey Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-slate-grey.webp",
            },
            {
              key: "basin-round-stone-grey",
              productKey: "basin-round-stone-grey",
              title: "Stone Grey Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-stone-grey.webp",
            },
            {
              key: "basin-round-tangerine",
              productKey: "basin-round-tangerine",
              title: "Tangerine Round Ceramic",
              subtitle: basinDimensionsText.round,
              image: "images/basin/hera-round-ceramic-basin-tangerine.webp",
            },
          ],
        },
      },
    },
    l7: {
      items: {
        popup: {
          title: "Pop-Up",
          parent: "popup",
          choices: [
            {
              key: "popup-gold",
              productKey: "popup-gold",
              title: "Gold",
              image: "images/popup/popup-gold.webp",
            },
            {
              key: "popup-gun-metal",
              productKey: "popup-gun-metal",
              title: "Gun Metal",
              image: "images/popup/popup-gun-metal.webp",
            },
            {
              key: "popup-matt-black",
              productKey: "popup-matt-black",
              title: "Matt Black",
              image: "images/popup/popup-matt-black.webp",
            },
            {
              key: "popup-rose-gold",
              productKey: "popup-rose-gold",
              title: "Rose Gold",
              image: "images/popup/popup-rose-gold.webp",
            },
          ],
        },
      },
    },
  },
};

type PopUpInfo = {
  title: string;
  subtitle?: string;
  buttonText?: string;
  maxStep: number;
  l1: {
    items: {
      title: string;
      choices: {
        key: string;
        title?: string;
        image?: string;
      }[];
    }[];
  };
  l2: Level;
  l3?: Level;
  l4?: Level;
  l5?: Level;
  l6?: Level;
  l7?: Level;
};

type Level = IndependentLevel | DependentLevel;

type DependentLevel = {
  items: Record<string, ProductRecord>;
};

function isDependentLevel(
  level: IndependentLevel | DependentLevel,
): level is DependentLevel {
  return !Array.isArray(level.items);
}

type IndependentLevel = {
  items: {
    title: string;
    choices: {
      key: string;
      title?: string;
      image?: string;
      hideIf?: (keys: string[]) => boolean;
      nextLevelKey?: string;
      computeNextLevelKey?: (keys: string[]) => string;
    }[];
  }[];
};

type ProductRecord = {
  parent: string;
  title: string;
  nextLevelKey?: string; // to determine the next level (record-level)
  computeNextLevelKey?: (keys: string[]) => string; // (prioritized) to determine the next level (record-level)
  choices: ProductChoice[];
};

type ProductChoice = {
  key: string; // for React Component
  productKey?: string; // for constructing product

  nextLevelKey?: string; // to determine the next level (choice-level)
  computeNextLevelKey?: (keys: string[]) => string; // (prioritized) to determine the next level (choice-level)
  title?: string;
  subtitle?: string;
  image?: string;
};

export default CustomizePopUp;
