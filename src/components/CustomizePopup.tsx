import React, { useState } from "react";
import clsx from "clsx";
import useStore from "../store/useStore";
import { Button, Modal, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

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
  const clearCustomizeSelectedLevelKeys = useStore(
    (state) => state.clearCustomizeSelectedLevelKeys,
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
        {popUpInfo.l1.items.map((l1) => (
          <div key={l1.title} className="flex flex-col gap-4">
            <Title order={3}>{l1.title}</Title>
            <div className="grid grid-cols-3 gap-4">
              {l1.choices.map((choice) => {
                const selected = customizeSelected[0] === choice.key;
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
                      clearCustomizeSelected();
                      addCustomizeSelected(choice.key, 0);

                      clearCustomizeSelectedLevelKeys();
                      addCustomizeSelectedLevelKey(choice.key, 0);

                      setStep(1);
                    }}
                  >
                    {choice.image ? (
                      <div className="relative w-full pb-[100%]">
                        <img
                          className="absolute left-0 top-0 h-full w-full object-cover"
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
        ))}
        {step >= 1 &&
          customizeSelected.length > 0 &&
          customizeSelected[0] in popUpInfo.l2.items && (
            <div className="flex flex-col gap-4">
              <Title order={3}>
                {popUpInfo.l2.items[customizeSelected[0]].title}
              </Title>
              <div className="grid grid-cols-3 items-center justify-items-center gap-4">
                {popUpInfo.l2.items[customizeSelectedLevelKeys[0]].choices.map(
                  (choice) => {
                    const selected = customizeSelected[1] === choice.productKey;
                    const currentRecord =
                      popUpInfo.l2.items[customizeSelectedLevelKeys[0]];
                    return (
                      <button
                        key={choice.key}
                        className={clsx(
                          "flex h-fit min-h-min w-full flex-col items-center justify-between rounded-md border-4 p-2",
                          {
                            "border-brand": selected,
                            "border-transparent hover:border-gray-300":
                              !selected,
                          },
                        )}
                        onClick={() => {
                          addCustomizeSelected(choice.productKey, 1);

                          if (choice.nextLevelKey) {
                            addCustomizeSelectedLevelKey(
                              choice.nextLevelKey,
                              1,
                            );
                          } else if (currentRecord.nextLevelKey) {
                            addCustomizeSelectedLevelKey(
                              currentRecord.nextLevelKey,
                              1,
                            );
                          }
                          setStep(Math.max(2, step));
                        }}
                      >
                        {choice.image ? (
                          <div className="relative w-full pb-[100%]">
                            <img
                              className="absolute left-0 top-0 h-full w-full object-cover"
                              src={choice.image}
                              alt={choice.title}
                            />
                          </div>
                        ) : (
                          choice.title
                        )}
                        {choice.title && <Text size="sm">{choice.title}</Text>}
                        {choice.subtitle && (
                          <Text size="xs" c="dimmed">
                            {choice.subtitle}
                          </Text>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          )}
        {step >= 2 &&
          popUpInfo.l3 &&
          customizeSelectedLevelKeys[1] in popUpInfo.l3.items && (
            <div className="flex flex-col gap-4">
              <Title order={3}>
                {popUpInfo.l3.items[customizeSelectedLevelKeys[1]].title}
              </Title>
              <div className="grid grid-cols-3 items-center justify-items-center gap-4">
                {popUpInfo.l3.items[customizeSelectedLevelKeys[1]].choices.map(
                  (choice) => {
                    const selected = customizeSelected[2] === choice.productKey;
                    return (
                      <button
                        key={choice.key}
                        className={clsx(
                          "flex h-fit min-h-min w-full flex-col items-center justify-between rounded-md border-4 p-2",
                          {
                            "border-brand": selected,
                            "border-transparent hover:border-gray-300":
                              !selected,
                          },
                        )}
                        onClick={() => {
                          addCustomizeSelected(choice.productKey, 2);
                          setStep(Math.max(3, step));
                        }}
                      >
                        {choice.image ? (
                          <div className="relative w-full pb-[100%]">
                            <img
                              className="absolute left-0 top-0 h-full w-full object-cover"
                              src={choice.image}
                              alt={choice.title}
                            />
                          </div>
                        ) : (
                          choice.title
                        )}
                        {choice.title && <Text size="sm">{choice.title}</Text>}
                        {choice.subtitle && (
                          <Text size="xs" c="dimmed">
                            {choice.subtitle}
                          </Text>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
              {customizeSelected.length >= 1 &&
                (customizeSelected[1].includes("hybrid") ? (
                  <div className="flex flex-col gap-2">
                    <Title order={3}>Tap</Title>
                    <Text size="sm">
                      Our enhanced package reuses the BTO default tap,
                      thoughtfully integrated into a stylish cabinet set. This
                      approach not only enhances your bathroom's aesthetics but
                      also reflects our commitment to sustainability.
                    </Text>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Title order={3}>Basin and Tap</Title>
                    <Text size="sm">
                      Our enhanced package reuses the BTO default basin and tap,
                      thoughtfully integrated into a stylish cabinet set. This
                      approach not only enhances your bathroom's aesthetics but
                      also reflects our commitment to sustainability.
                    </Text>
                  </div>
                ))}
            </div>
          )}
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
  "600": "W:596 x H:450 x D:455 mm",
  "800": "W:796 x H:450 x D:455 mm",
};

const vanityCabinetHybridDimensionsText = {
  "500": "W:500 x H:455 x D:386 mm",
  "600": "W:600 x H:455 x D:386 mm",
  "800": "W:800 x H:455 x D:386 mm",
};

const countertopDimensionsText = {
  "600": "W:615 x H:10 x D:465 mm",
  "800": "W:815 x H:10 x D:465 mm",
};

const insertBasinDimensionsText = {
  "500": {
    ceramic: " W:510 x H:164 x D:395 mm",
    glass: "W:515 x H:150 x D:400 mm",
  },
  "600": {
    ceramic: "W:610 x H:164 x D:395 mm",
    glass: "W:615 x H:150 x D:400 mm",
  },
  "800": {
    ceramic: "W:810 x H:164 x D:395 mm",
    glass: "W:815 x H:150 x D:400 mm",
  },
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
    maxStep: 3,
    l1: {
      items: [
        {
          title: "Sizes",
          choices: [
            {
              key: "500",
              title: "500mm",
            },
            {
              key: "600",
              title: "600mm",
            },
            {
              key: "800",
              title: "800mm",
            },
          ],
        },
      ],
    },
    l2: {
      items: {
        "500": {
          parent: "500",
          nextLevelKey: "500-hybrid",
          title: "Cabinet",
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
        "600": {
          parent: "600",
          nextLevelKey: "600-normal",
          title: "Cabinet",
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
            {
              key: "vanity-hybrid-pebble-600mm",
              productKey: "hybrid-pebble",
              title: "Hybrid Pebble",
              subtitle: vanityCabinetHybridDimensionsText["600"],
              image: "images/vanity-cabinet/hybrid-pebble-600mm.webp",
              nextLevelKey: "600-hybrid",
            },
            {
              key: "vanity-hybrid-pine-600mm",
              productKey: "hybrid-pine",
              title: "Hybrid Pine",
              subtitle: vanityCabinetHybridDimensionsText["600"],
              image: "images/vanity-cabinet/hybrid-pine-600mm.webp",
              nextLevelKey: "600-hybrid",
            },
            {
              key: "vanity-hybrid-walnut-600mm",
              productKey: "hybrid-walnut",
              title: "Hybrid Walnut",
              subtitle: vanityCabinetHybridDimensionsText["600"],
              image: "images/vanity-cabinet/hybrid-walnut-600mm.webp",
              nextLevelKey: "600-hybrid",
            },
          ],
        },
        "800": {
          nextLevelKey: "800-normal",
          parent: "800",
          title: "Cabinet",
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
            {
              key: "vanity-hybrid-pebble-800mm",
              productKey: "hybrid-pebble",
              title: "Hybrid Pebble",
              subtitle: vanityCabinetHybridDimensionsText["800"],
              image: "images/vanity-cabinet/hybrid-pebble-800mm.webp",
              nextLevelKey: "800-hybrid",
            },
            {
              key: "vanity-hybrid-pine-800mm",
              productKey: "hybrid-pine",
              title: "Hybrid Pine",
              subtitle: vanityCabinetHybridDimensionsText["800"],
              image: "images/vanity-cabinet/hybrid-pine-800mm.webp",
              nextLevelKey: "800-hybrid",
            },
            {
              key: "vanity-hybrid-walnut-800mm",
              productKey: "hybrid-walnut",
              title: "Hybrid Walnut",
              subtitle: vanityCabinetHybridDimensionsText["800"],
              image: "images/vanity-cabinet/hybrid-walnut-800mm.webp",
              nextLevelKey: "800-hybrid",
            },
          ],
        },
      },
    },
    l3: {
      items: {
        "500-hybrid": {
          parent: "500",
          title: "Insert Basin",
          choices: [
            {
              key: "insert-basin-ceramic-500mm",
              productKey: "insert-basin-ceramic",
              title: "White Ceramic Insert Basin",
              subtitle: insertBasinDimensionsText["500"].ceramic,
              image: "images/insert-basin/ceramic-helios.webp",
            },
            {
              key: "insert-basin-glass-black-500mm",
              productKey: "insert-basin-glass-black",
              title: "Black Glass Insert Basin",
              subtitle: insertBasinDimensionsText["500"].glass,
              image: "images/insert-basin/glass-black.webp",
            },
            {
              key: "insert-basin-glass-white-500mm",
              productKey: "insert-basin-glass-white",
              title: "White Glass Insert Basin",
              subtitle: insertBasinDimensionsText["500"].glass,
              image: "images/insert-basin/glass-white.webp",
            },
          ],
        },
        "600-normal": {
          parent: "600",
          title: "Counter Top",
          choices: [
            {
              key: "counter-top-black-600mm",
              productKey: "counter-top-black",
              title: "Black Quartz Countertop",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-black.webp",
            },
            {
              key: "counter-top-white-600mm",
              productKey: "counter-top-white",
              title: "White Quartz Countertop",
              subtitle: countertopDimensionsText["600"],
              image: "images/counter-top/countertop-white.webp",
            },
          ],
        },
        "600-hybrid": {
          parent: "600-hybrid",
          title: "Insert Basin",
          choices: [
            {
              key: "insert-basin-ceramic-600mm",
              productKey: "insert-basin-ceramic",
              title: "White Ceramic Insert Basin",
              subtitle: insertBasinDimensionsText["600"].ceramic,
              image: "images/insert-basin/ceramic-helios.webp",
            },
            {
              key: "insert-basin-glass-black-600mm",
              productKey: "insert-basin-glass-black",
              title: "Black Glass Insert Basin",
              subtitle: insertBasinDimensionsText["600"].glass,
              image: "images/insert-basin/glass-black.webp",
            },
            {
              key: "insert-basin-glass-white-600mm",
              productKey: "insert-basin-glass-white",
              title: "White Glass Insert Basin",
              subtitle: insertBasinDimensionsText["600"].glass,
              image: "images/insert-basin/glass-white.webp",
            },
          ],
        },
        "800-normal": {
          parent: "800",
          title: "Counter Top",
          choices: [
            {
              key: "counter-top-black-800mm",
              productKey: "counter-top-black",
              title: "Black Quartz Countertop",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-black.webp",
            },
            {
              key: "counter-top-white-800mm",
              productKey: "counter-top-white",
              title: "White Quartz Countertop",
              subtitle: countertopDimensionsText["800"],
              image: "images/counter-top/countertop-white.webp",
            },
          ],
        },
        "800-hybrid": {
          parent: "800-hybrid",
          title: "Insert Basin",
          choices: [
            {
              key: "insert-basin-ceramic-800mm",
              productKey: "insert-basin-ceramic",
              title: "White Ceramic Insert Basin",
              subtitle: insertBasinDimensionsText["800"].ceramic,
              image: "images/insert-basin/ceramic-helios.webp",
            },
            {
              key: "insert-basin-glass-black-800mm",
              productKey: "insert-basin-glass-black",
              title: "Black Glass Insert Basin",
              subtitle: insertBasinDimensionsText["800"].glass,
              image: "images/insert-basin/glass-black.webp",
            },
            {
              key: "insert-basin-glass-white-800mm",
              productKey: "insert-basin-glass-white",
              title: "White Glass Insert Basin",
              subtitle: insertBasinDimensionsText["800"].glass,
              image: "images/insert-basin/glass-white.webp",
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
  l2: { items: Record<string, ProductRecord> };
  l3?: { items: Record<string, ProductRecord> };
};

type ProductRecord = {
  parent: string;
  title: string;
  nextLevelKey?: string; // to determine the next level (record-level)
  choices: ProductChoice[];
};

type ProductChoice = {
  key: string; // for React Component
  productKey: string; // for constructing product
  nextLevelKey?: string; // to determine the next level (choice-level)
  title?: string;
  subtitle?: string;
  image?: string;
};

export default CustomizePopUp;
