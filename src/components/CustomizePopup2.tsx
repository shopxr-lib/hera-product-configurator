import React, { useEffect } from "react";
import clsx from "clsx";
import useStore, {
  ChoiceMap,
  ChoiceType,
  EventCallback,
  eventSystem,
} from "../store/useStore";
import { Modal, Text, Title } from "@mantine/core";

const CustomizePopUp: React.FC = () => {
  const customizePopUpKey = useStore((state) => state.customizePopUpKey);
  const opened = useStore((state) => state.modals.customize);
  const setModal = useStore((state) => state.setModal);

  const choiceMap = useStore((state) => state.choiceMap);
  const addChoice = useStore((state) => state.addChoice);

  const popUpInfo = PopUpInfos[customizePopUpKey];

  useEffect(() => {
    if (!popUpInfo) {
      return;
    }
    let firstChoice: SectionChoice | undefined = undefined;
    for (const section of popUpInfo.sections) {
      if (section.hideIf && section.hideIf(choiceMap)) {
        continue;
      }

      // already selected
      if (choiceMap[section.type]) {
        continue;
      }

      firstChoice = section.choices?.find(
        (choice) => !choice.hideIf?.(choiceMap),
      );
      if (!firstChoice) {
        firstChoice = section.groupChoices?.find(
          (group) => !group.hideIf?.(choiceMap),
        )?.choices?.[0];
      }

      if (firstChoice) {
        addChoice(
          {
            type: section.type,
            value: firstChoice.value,
            preserveSelection: firstChoice.preserveSelection,
          },
          "firstChoice",
        );
        break;
      }
    }
  }, [addChoice, choiceMap, popUpInfo]);

  if (!popUpInfo) {
    return null;
  }

  const handleClose = () => {
    setModal("customize", false);
  };

  const renderChoice = (section: Section, choice: SectionChoice) => {
    const selected = choiceMap[section.type]?.value === choice.value;

    return (
      <button
        key={choice.value}
        className={clsx(
          "flex h-full min-h-min w-full flex-col items-center justify-center rounded-md border-4 p-2",
          {
            "border-brand": selected,
            "border-transparent hover:border-gray-300": !selected,
          },
        )}
        onClick={() => {
          addChoice({
            type: section.type,
            value: choice.value,
            preserveSelection: choice.preserveSelection,
          });
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
        {choice.title && choice.image && <Text size="sm">{choice.title}</Text>}
        {choice.subtitle && (
          <Text size="xs" c="dimmed">
            {choice.subtitle}
          </Text>
        )}
      </button>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<p className="text-3xl font-bold">{popUpInfo.title}</p>}
      centered
      classNames={{
        content: "sm:left-4 sm:absolute sm:w-[400px]",
      }}
    >
      <div className="flex flex-col gap-8">
        <Text>{popUpInfo.subtitle}</Text>
        {popUpInfo.sections
          ?.filter((section) => !section.hideIf?.(choiceMap))
          ?.map((section) => {
            return (
              <div className="flex flex-col gap-4" key={section.title}>
                <Title order={4}>{section.title}</Title>
                <div className="grid auto-rows-fr grid-cols-3 items-center justify-center gap-4">
                  {section.choices
                    ?.filter((choice) => !choice.hideIf?.(choiceMap))
                    ?.map((choice) => renderChoice(section, choice))}

                  {section.groupChoices
                    ?.filter((group) => !group.hideIf?.(choiceMap))
                    ?.map((group) => {
                      return group.choices.map((choice) =>
                        renderChoice(section, choice),
                      );
                    })}
                </div>
              </div>
            );
          })}
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
  vanitycabinet: {
    title: "Vanity Cabinet Set",
    subtitle:
      "Mix & Match your very own vanity cabinet set & add it into the scene.",
    buttonText: "Add Furniture",
    sections: [
      {
        title: "Breadth",
        type: "breadth",
        choices: [
          {
            title: "40cm",
            value: 40,
          },
          {
            title: "46cm",
            value: 46,
          },
        ],
      },
      {
        title: "Width",
        type: "width",
        hideIf: (choiceMap) => !choiceMap.breadth,
        transition: [
          {
            eventType: "breadth",
            value: 46,
            to: 60,
          },
        ],
        choices: [
          {
            title: "50cm",
            value: 50,
            hideIf: (choiceMap) => choiceMap.breadth?.value === 46,
          },
          {
            title: "60cm",
            value: 60,
          },
          {
            title: "80cm",
            value: 80,
          },
        ],
      },
      {
        title: "Colors",
        type: "vanity-color",
        hideIf: (choiceMap) => !choiceMap.breadth || !choiceMap.width,
        groupChoices: [
          {
            name: "Breadth 40cm, Width 50cm",
            hideIf: (choiceMap) =>
              !(choiceMap.width?.value == 50 && choiceMap.breadth?.value == 40),
            choices: [
              {
                value: "vanity-cabinet-hybrid-pebble-500mm",
                title: "Hybrid Pebble",
                subtitle: vanityCabinetHybridDimensionsText["500"],
                image: "images/vanity-cabinet/hybrid-pebble-500mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-hybrid-pine-500mm",
                title: "Hybrid Pine",
                subtitle: vanityCabinetHybridDimensionsText["500"],
                image: "images/vanity-cabinet/hybrid-pine-500mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-hybrid-pine-600mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-hybrid-pine-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-hybrid-walnut-500mm",
                title: "Hybrid Walnut",
                subtitle: vanityCabinetHybridDimensionsText["500"],
                image: "images/vanity-cabinet/hybrid-walnut-500mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-hybrid-walnut-600mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-hybrid-walnut-800mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Breadth 40cm, Width 60cm",
            hideIf: (choiceMap) =>
              !(choiceMap.width?.value == 60 && choiceMap.breadth?.value == 40),
            choices: [
              {
                value: "vanity-cabinet-hybrid-pebble-600mm",
                title: "Hybrid Pebble",
                subtitle: vanityCabinetHybridDimensionsText["600"],
                image: "images/vanity-cabinet/hybrid-pebble-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "vanity-cabinet-hybrid-pebble-500mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "vanity-cabinet-birch-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-hybrid-pine-600mm",
                title: "Hybrid Pine",
                subtitle: vanityCabinetHybridDimensionsText["600"],
                image: "images/vanity-cabinet/hybrid-pine-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "vanity-cabinet-hybrid-pine-500mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-hybrid-pine-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "vanity-cabinet-birch-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-hybrid-walnut-600mm",
                title: "Hybrid Walnut",
                subtitle: vanityCabinetHybridDimensionsText["600"],
                image: "images/vanity-cabinet/hybrid-walnut-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "vanity-cabinet-hybrid-walnut-500mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-hybrid-walnut-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "vanity-cabinet-birch-600mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Breadth 40cm, Width 80cm",
            hideIf: (choiceMap) =>
              !(choiceMap.width?.value == 80 && choiceMap.breadth?.value == 40),
            choices: [
              {
                value: "vanity-cabinet-hybrid-pebble-800mm",
                title: "Hybrid Pebble",
                subtitle: vanityCabinetHybridDimensionsText["800"],
                image: "images/vanity-cabinet/hybrid-pebble-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "vanity-cabinet-hybrid-pebble-500mm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "vanity-cabinet-birch-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-hybrid-pine-800mm",
                title: "Hybrid Pine",
                subtitle: vanityCabinetHybridDimensionsText["800"],
                image: "images/vanity-cabinet/hybrid-pine-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "vanity-cabinet-hybrid-pine-500mm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-hybrid-pine-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "vanity-cabinet-birch-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-hybrid-walnut-800mm",
                title: "Hybrid Walnut",
                subtitle: vanityCabinetHybridDimensionsText["800"],
                image: "images/vanity-cabinet/hybrid-walnut-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "vanity-cabinet-hybrid-walnut-500mm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-hybrid-walnut-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "vanity-cabinet-birch-800mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Breadth 46cm, Width 60cm",
            hideIf: (choiceMap) =>
              !(choiceMap.width?.value == 60 && choiceMap.breadth?.value == 46),
            choices: [
              {
                value: "vanity-cabinet-birch-600mm",
                title: "Birch",
                subtitle: vanityCabinetDimensionsText["600"],
                image: "images/vanity-cabinet/birch-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-birch-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-blanco-600mm",
                title: "Blanco",
                subtitle: vanityCabinetDimensionsText["600"],
                image: "images/vanity-cabinet/blanco-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-blanco-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-brown-stone-600mm",
                title: "Brownstone",
                subtitle: vanityCabinetDimensionsText["600"],
                image: "images/vanity-cabinet/brownstone-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-brown-stone-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-charcoal-ash-600mm",
                title: "Charcoal Ash",
                subtitle: vanityCabinetDimensionsText["600"],
                image: "images/vanity-cabinet/charcoal-ash-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-charcoal-ash-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-graphite-600mm",
                title: "Graphite",
                subtitle: vanityCabinetDimensionsText["600"],
                image: "images/vanity-cabinet/graphite-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-graphite-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-matt-black-600mm",
                title: "Matt Black",
                subtitle: vanityCabinetDimensionsText["600"],
                image: "images/vanity-cabinet/matt-black-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-matt-black-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-oakwood-600mm",
                title: "Oakwood",
                subtitle: vanityCabinetDimensionsText["600"],
                image: "images/vanity-cabinet/oakwood-600mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "vanity-cabinet-oakwood-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-600mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Breadth 46cm, Width 80cm",
            hideIf: (choiceMap) =>
              !(choiceMap.width?.value == 80 && choiceMap.breadth?.value == 46),
            choices: [
              {
                value: "vanity-cabinet-birch-800mm",
                title: "Birch",
                subtitle: vanityCabinetDimensionsText["800"],
                image: "images/vanity-cabinet/birch-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-birch-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-blanco-800mm",
                title: "Blanco",
                subtitle: vanityCabinetDimensionsText["800"],
                image: "images/vanity-cabinet/blanco-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-blanco-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-brown-stone-800mm",
                title: "Brownstone",
                subtitle: vanityCabinetDimensionsText["800"],
                image: "images/vanity-cabinet/brownstone-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-brown-stone-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-charcoal-ash-800mm",
                title: "Charcoal",
                subtitle: vanityCabinetDimensionsText["800"],
                image: "images/vanity-cabinet/charcoal-ash-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-charcoal-ash-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-graphite-800mm",
                title: "Graphite",
                subtitle: vanityCabinetDimensionsText["800"],
                image: "images/vanity-cabinet/graphite-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-graphite-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-matt-black-800mm",
                title: "Matt Black",
                subtitle: vanityCabinetDimensionsText["800"],
                image: "images/vanity-cabinet/matt-black-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-matt-black-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
              {
                value: "vanity-cabinet-oakwood-800mm",
                title: "Oakwood",
                subtitle: vanityCabinetDimensionsText["800"],
                image: "images/vanity-cabinet/oakwood-800mm.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "vanity-cabinet-oakwood-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "vanity-cabinet-hybrid-pebble-800mm",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Top",
        type: "top",
        hideIf: (choiceMap) => {
          return !choiceMap["vanity-color"];
        },
        choices: [
          {
            title: "Insert Basin",
            value: "insert-basin",
          },
          {
            hideIf: (choiceMap) => choiceMap.breadth?.value === 40,
            title: "Countertop",
            value: "counter-top",
            transition: [
              {
                eventType: "breadth",
                value: 40,
                to: "insert-basin",
              },
            ],
          },
        ],
      },
      {
        title: "Insert Basin",
        type: "insert-basin",
        transition: [
          {
            eventType: "top",
            value: "counter-top",
            to: null,
          },
        ],
        hideIf: (choiceMap) =>
          !choiceMap["vanity-color"] || choiceMap.top?.value !== "insert-basin",
        groupChoices: [
          {
            name: "Insert Basin - 60 cm",
            hideIf: (choiceMap) =>
              !(
                choiceMap.width?.value === 60 && choiceMap.breadth?.value === 46
              ),
            choices: [
              {
                value: "insert-basin-ceramic-600mm",
                title: "White Ceramic",
                subtitle: insertBasinDimensionsText["600"].ceramic,
                image: "images/insert-basin/ceramic-helios.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-ceramic-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "insert-basin-hybrid-ceramic-600mm",
                  },
                ],
              },
              {
                value: "insert-basin-glass-black-600mm",
                title: "Black Glass",
                subtitle: insertBasinDimensionsText["600"].glass,
                image: "images/insert-basin/glass-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-glass-black-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "insert-basin-hybrid-glass-black-600mm",
                  },
                ],
              },
              {
                value: "insert-basin-glass-white-600mm",
                title: "White Glass",
                subtitle: insertBasinDimensionsText["600"].glass,
                image: "images/insert-basin/glass-white.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-glass-white-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "insert-basin-hybrid-glass-white-600mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Insert Basin - 80 cm",
            hideIf: (choiceMap) =>
              !(
                choiceMap.width?.value === 80 && choiceMap.breadth?.value === 46
              ),
            choices: [
              {
                value: "insert-basin-ceramic-800mm",
                title: "White Ceramic",
                subtitle: insertBasinDimensionsText["800"].ceramic,
                image: "images/insert-basin/ceramic-helios.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-ceramic-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "insert-basin-hybrid-ceramic-800mm",
                  },
                ],
              },
              {
                value: "insert-basin-glass-black-800mm",
                title: "Black Glass",
                subtitle: insertBasinDimensionsText["800"].glass,
                image: "images/insert-basin/glass-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-glass-black-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "insert-basin-hybrid-glass-black-800mm",
                  },
                ],
              },
              {
                value: "insert-basin-glass-white-800mm",
                title: "White Glass",
                subtitle: insertBasinDimensionsText["800"].glass,
                image: "images/insert-basin/glass-white.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-glass-white-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 40,
                    to: "insert-basin-hybrid-glass-white-800mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Insert Basin Hybrid - 50 cm",
            hideIf: (choiceMap) =>
              !(
                choiceMap.width?.value === 50 && choiceMap.breadth?.value === 40
              ),
            choices: [
              {
                value: "insert-basin-hybrid-ceramic-500mm",
                title: "Hybrid White Ceramic",
                subtitle: insertBasinDimensionsText["500"].ceramic,
                image: "images/insert-basin/ceramic-helios.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-hybrid-ceramic-600mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-hybrid-ceramic-800mm",
                  },
                ],
              },
              {
                value: "insert-basin-hybrid-glass-black-500mm",
                title: "Hybrid Black Glass",
                subtitle: insertBasinDimensionsText["500"].glass,
                image: "images/insert-basin/glass-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-hybrid-glass-black-600mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-hybrid-glass-black-800mm",
                  },
                ],
              },
              {
                value: "insert-basin-hybrid-glass-white-500mm",
                title: "Hybrid White Glass",
                subtitle: insertBasinDimensionsText["500"].glass,
                image: "images/insert-basin/glass-white.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-hybrid-glass-white-600mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-hybrid-glass-white-800mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Insert Basin Hybrid - 60 cm",
            hideIf: (choiceMap) =>
              !(
                choiceMap.width?.value === 60 && choiceMap.breadth?.value === 40
              ),
            choices: [
              {
                value: "insert-basin-hybrid-ceramic-600mm",
                title: "Hybrid White Ceramic",
                subtitle: insertBasinDimensionsText["600"].ceramic,
                image: "images/insert-basin/ceramic-helios.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "insert-basin-hybrid-ceramic-500mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-hybrid-ceramic-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "insert-basin-ceramic-600mm",
                  },
                ],
              },
              {
                value: "insert-basin-hybrid-glass-black-600mm",
                title: "Hybrid Black Glass",
                subtitle: insertBasinDimensionsText["600"].glass,
                image: "images/insert-basin/glass-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "insert-basin-hybrid-glass-black-500mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-hybrid-glass-black-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "insert-basin-glass-black-600mm",
                  },
                ],
              },
              {
                value: "insert-basin-hybrid-glass-white-600mm",
                title: "Hybrid White Glass",
                subtitle: insertBasinDimensionsText["600"].glass,
                image: "images/insert-basin/glass-white.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "insert-basin-hybrid-glass-white-500mm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "insert-basin-hybrid-glass-white-800mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "insert-basin-glass-white-600mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Insert Basin Hybrid - 80 cm",
            hideIf: (choiceMap) =>
              !(
                choiceMap.width?.value === 80 && choiceMap.breadth?.value === 40
              ),
            choices: [
              {
                value: "insert-basin-hybrid-ceramic-800mm",
                title: "Hybrid White Ceramic",
                subtitle: insertBasinDimensionsText["800"].ceramic,
                image: "images/insert-basin/ceramic-helios.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "insert-basin-hybrid-ceramic-500mm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-hybrid-ceramic-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "insert-basin-ceramic-800mm",
                  },
                ],
              },
              {
                value: "insert-basin-hybrid-glass-black-800mm",
                title: "Hybrid Black Glass",
                subtitle: insertBasinDimensionsText["800"].glass,
                image: "images/insert-basin/glass-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "insert-basin-hybrid-glass-black-500mm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-hybrid-glass-black-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "insert-basin-glass-black-800mm",
                  },
                ],
              },
              {
                value: "insert-basin-hybrid-glass-white-800mm",
                title: "Hybrid White Glass",
                subtitle: insertBasinDimensionsText["800"].glass,
                image: "images/insert-basin/glass-white.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "insert-basin-hybrid-glass-white-500mm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "insert-basin-hybrid-glass-white-600mm",
                  },
                  {
                    eventType: "breadth",
                    value: 46,
                    to: "insert-basin-glass-white-800mm",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Counter Top",
        type: "counter-top",
        transition: [
          {
            eventType: "top",
            value: "insert-basin",
            to: null,
          },
        ],
        hideIf: (choiceMap) =>
          !(
            choiceMap["vanity-color"] && choiceMap.top?.value === "counter-top"
          ),
        groupChoices: [
          {
            name: "Counter Top - 60 cm",
            hideIf: (choiceMap) => choiceMap.width?.value !== 60,
            choices: [
              {
                value: "counter-top-birch-600mm",
                title: "Birch",
                subtitle: countertopDimensionsText["600"],
                image: "images/counter-top/countertop-birch.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "counter-top-birch-800mm",
                  },
                ],
              },
              {
                value: "counter-top-brownstone-600mm",
                title: "Brownstone",
                subtitle: countertopDimensionsText["600"],
                image: "images/counter-top/countertop-brownstone.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "counter-top-brownstone-800mm",
                  },
                ],
              },
              {
                value: "counter-top-charcoal-ash-600mm",
                title: "Charcoal Ash",
                subtitle: countertopDimensionsText["600"],
                image: "images/counter-top/countertop-charcoal-ash.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "counter-top-charcoal-ash-800mm",
                  },
                ],
              },
              {
                value: "counter-top-oakwood-600mm",
                title: "Oakwood",
                subtitle: countertopDimensionsText["600"],
                image: "images/counter-top/countertop-oakwood.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "counter-top-oakwood-800mm",
                  },
                ],
              },
              {
                value: "counter-top-black-600mm",
                title: "Black Quartz",
                subtitle: countertopDimensionsText["600"],
                image: "images/counter-top/countertop-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "counter-top-black-800mm",
                  },
                ],
              },
              {
                value: "counter-top-white-600mm",
                title: "White Quartz",
                subtitle: countertopDimensionsText["600"],
                image: "images/counter-top/countertop-white.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 80,
                    to: "counter-top-white-800mm",
                  },
                ],
              },
            ],
          },
          {
            name: "Counter Top - 80 cm",
            hideIf: (choiceMap) => choiceMap.width?.value !== 80,
            choices: [
              {
                value: "counter-top-birch-800mm",
                title: "Birch",
                subtitle: countertopDimensionsText["800"],
                image: "images/counter-top/countertop-birch.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "counter-top-birch-600mm",
                  },
                ],
              },
              {
                value: "counter-top-brownstone-800mm",
                title: "Brownstone",
                subtitle: countertopDimensionsText["800"],
                image: "images/counter-top/countertop-brownstone.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "counter-top-brownstone-600mm",
                  },
                ],
              },
              {
                value: "counter-top-charcoal-ash-800mm",
                title: "Charcoal Ash",
                subtitle: countertopDimensionsText["800"],
                image: "images/counter-top/countertop-charcoal-ash.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "counter-top-charcoal-ash-600mm",
                  },
                ],
              },
              {
                value: "counter-top-oakwood-800mm",
                title: "Oakwood",
                subtitle: countertopDimensionsText["800"],
                image: "images/counter-top/countertop-oakwood.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "counter-top-oakwood-600mm",
                  },
                ],
              },
              {
                value: "counter-top-black-800mm",
                title: "Black Quartz",
                subtitle: countertopDimensionsText["800"],
                image: "images/counter-top/countertop-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "counter-top-black-600mm",
                  },
                ],
              },
              {
                value: "counter-top-white-800mm",
                title: "White Quartz",
                subtitle: countertopDimensionsText["800"],
                image: "images/counter-top/countertop-white.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "counter-top-white-600mm",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Overflow Ring",
        type: "overflow-ring",
        hideIf: (choiceMap) =>
          !(
            choiceMap["vanity-color"] &&
            choiceMap.top?.value === "insert-basin" &&
            new RegExp(`ceramic`).test(String(choiceMap["insert-basin"]?.value))
          ),
        transition: [
          {
            eventType: "insert-basin",
            value: "glass",
            to: null,
          },
          {
            eventType: "top",
            value: "counter-top",
            to: null,
          },
        ],
        choices: [
          {
            value: "basin-overflow-ring-chrome",
            title: "Chrome",
            image: "images/basin-overflow-ring/basin-overflow-ring-chrome.webp",
          },
          {
            value: "basin-overflow-ring-gold",
            title: "Gold",
            image: "images/basin-overflow-ring/basin-overflow-ring-gold.webp",
          },
          {
            value: "basin-overflow-ring-gun-metal",
            title: "Gun Metal",
            image:
              "images/basin-overflow-ring/basin-overflow-ring-gun-metal.webp",
          },
          {
            value: "basin-overflow-ring-matt-black",
            title: "Matt Black",
            image:
              "images/basin-overflow-ring/basin-overflow-ring-matt-black.webp",
          },
          {
            value: "basin-overflow-ring-rose-gold",
            title: "Rose Gold",
            image:
              "images/basin-overflow-ring/basin-overflow-ring-rose-gold.webp",
          },
        ],
      },
      {
        title: "Pop-Up",
        type: "popup",
        hideIf: (choiceMap) =>
          !(
            choiceMap["vanity-color"] && choiceMap.top?.value === "insert-basin"
          ),
        transition: [
          {
            eventType: "top",
            value: "counter-top",
            to: null,
          },
        ],
        choices: [
          {
            value: "popup-chrome",
            title: "Chrome",
            image: "images/popup/popup-chrome.webp",
          },
          {
            value: "popup-gold",
            title: "Gold",
            image: "images/popup/popup-gold.webp",
          },
          {
            value: "popup-gun-metal",
            title: "Gun Metal",
            image: "images/popup/popup-gun-metal.webp",
          },
          {
            value: "popup-matt-black",
            title: "Matt Black",
            image: "images/popup/popup-matt-black.webp",
          },
          {
            value: "popup-rose-gold",
            title: "Rose Gold",
            image: "images/popup/popup-rose-gold.webp",
          },
        ],
      },
      {
        title: "Basin",
        type: "basin",
        hideIf: (choiceMap) =>
          !(
            choiceMap["vanity-color"] && choiceMap.top?.value === "counter-top"
          ),
        transition: [
          {
            eventType: "top",
            value: "insert-basin",
            to: null,
          },
        ],
        choices: [
          {
            value: "basin-rectangular-ceramic-blush",
            title: "Blush Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image: "images/basin/hera-rectangular-ceramic-basin-blush.webp",
          },
          {
            value: "basin-rectangular-ceramic-eclair",
            title: "Eclair Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image: "images/basin/hera-rectangular-ceramic-basin-eclair.webp",
          },
          {
            value: "basin-rectangular-ceramic-matt-black",
            title: "Matt Black Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image:
              "images/basin/hera-rectangular-ceramic-basin-matt-black.webp",
          },
          {
            value: "basin-rectangular-ceramic-matt-white",
            title: "Matt White Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image:
              "images/basin/hera-rectangular-ceramic-basin-matt-white.webp",
          },
          {
            value: "basin-rectangular-ceramic-mocha",
            title: "Mocha Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image: "images/basin/hera-rectangular-ceramic-basin-mocha.webp",
          },
          {
            value: "basin-rectangular-ceramic-moss",
            title: "Moss Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image: "images/basin/hera-rectangular-ceramic-basin-moss.webp",
          },
          {
            value: "basin-rectangular-ceramic-slate-grey",
            title: "Slate Grey Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image:
              "images/basin/hera-rectangular-ceramic-basin-slate-grey.webp",
          },
          {
            value: "basin-rectangular-ceramic-storm",
            title: "Storm Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image: "images/basin/hera-rectangular-ceramic-basin-storm.webp",
          },
          {
            value: "basin-rectangular-ceramic-teal",
            title: "Teal Rectangular Ceramic",
            subtitle: basinDimensionsText.rectangular,
            image: "images/basin/hera-rectangular-ceramic-basin-teal.webp",
          },
          {
            value: "basin-round-ceramic-blush",
            title: "Blush Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-blush.webp",
          },
          {
            value: "basin-round-ceramic-matt-black",
            title: "Matt Black Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-matt-black.webp",
          },
          {
            value: "basin-round-ceramic-matt-white",
            title: "Matt White Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-matt-white.webp",
          },
          {
            value: "basin-round-ceramic-mint",
            title: "Mint Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-mint.webp",
          },
          {
            value: "basin-round-ceramic-mocha",
            title: "Mocha Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-mocha.webp",
          },
          {
            value: "basin-round-ceramic-slate-grey",
            title: "Slate Grey Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-slate-grey.webp",
          },
          {
            value: "basin-round-ceramic-stone-grey",
            title: "Stone Grey Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-stone-grey.webp",
          },
          {
            value: "basin-round-ceramic-tangerine",
            title: "Tangerine Round Ceramic",
            subtitle: basinDimensionsText.round,
            image: "images/basin/hera-round-ceramic-basin-tangerine.webp",
          },
        ],
      },
      {
        title: "Tap",
        type: "tap",
        hideIf: (choiceMap) =>
          !choiceMap["top"] ||
          (choiceMap["top"]?.value === "insert-basin" &&
            !choiceMap["insert-basin"]) ||
          (choiceMap["top"]?.value === "counter-top" && !choiceMap["basin"]),
        transition: [{ eventType: "top", to: null }],
        choices: [
          {
            title: "Chrome 8101",
            value: "tap-chrome-8101",
            image: "images/tap/tap-chrome-8101-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Chrome 8102",
            value: "tap-chrome-8102",
            image: "images/tap/tap-chrome-8102-large.webp",
          },
          {
            title: "Chrome 8201",
            value: "tap-chrome-8201",
            image: "images/tap/tap-chrome-8201-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Chrome 8202",
            value: "tap-chrome-8202",
            image: "images/tap/tap-chrome-8202-large.webp",
          },
          {
            title: "Chrome 8301",
            value: "tap-chrome-8301",
            image: "images/tap/tap-chrome-8301-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Chrome 8302",
            value: "tap-chrome-8302",
            image: "images/tap/tap-chrome-8302-large.webp",
          },
          {
            title: "Gun Metal 8101",
            value: "tap-gun-metal-8101",
            image: "images/tap/tap-gun-metal-8101-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Gun Metal 8102",
            value: "tap-gun-metal-8102",
            image: "images/tap/tap-gun-metal-8102-large.webp",
          },
          {
            title: "Gun Metal 8201",
            value: "tap-gun-metal-8201",
            image: "images/tap/tap-gun-metal-8201-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Gun Metal 8202",
            value: "tap-gun-metal-8202",
            image: "images/tap/tap-gun-metal-8202-large.webp",
          },
          {
            title: "Gun Metal 8301",
            value: "tap-gun-metal-8301",
            image: "images/tap/tap-gun-metal-8301-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Gun Metal 8302",
            value: "tap-gun-metal-8302",
            image: "images/tap/tap-gun-metal-8302-large.webp",
          },
          {
            title: "Matt Black 8101",
            value: "tap-matt-black-8101",
            image: "images/tap/tap-matt-black-8101-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Matt Black 8102",
            value: "tap-matt-black-8102",
            image: "images/tap/tap-matt-black-8102-large.webp",
          },
          {
            title: "Matt Black 8201",
            value: "tap-matt-black-8201",
            image: "images/tap/tap-matt-black-8201-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Matt Black 8202",
            value: "tap-matt-black-8202",
            image: "images/tap/tap-matt-black-8202-large.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Matt Black 8301",
            value: "tap-matt-black-8301",
            image: "images/tap/tap-matt-black-8301-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Matt Black 8302",
            value: "tap-matt-black-8302",
            image: "images/tap/tap-matt-black-8302-large.webp",
          },
          {
            title: "Matt Gold 8101",
            value: "tap-matt-gold-8101",
            image: "images/tap/tap-matt-gold-8101-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Matt Gold 8102",
            value: "tap-matt-gold-8102",
            image: "images/tap/tap-matt-gold-8102-large.webp",
          },
          {
            title: "Matt Gold 8201",
            value: "tap-matt-gold-8201",
            image: "images/tap/tap-matt-gold-8201-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Matt Gold 8202",
            value: "tap-matt-gold-8202",
            image: "images/tap/tap-matt-gold-8202-large.webp",
          },
          {
            title: "Matt Gold 8301",
            value: "tap-matt-gold-8301",
            image: "images/tap/tap-matt-gold-8301-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Matt Gold 8302",
            value: "tap-matt-gold-8302",
            image: "images/tap/tap-matt-gold-8302-large.webp",
          },
          {
            title: "Rose Gold 8101",
            value: "tap-rose-gold-8101",
            image: "images/tap/tap-rose-gold-8101-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Rose Gold 8102",
            value: "tap-rose-gold-8102",
            image: "images/tap/tap-rose-gold-8102-large.webp",
          },
          {
            title: "Rose Gold 8201",
            value: "tap-rose-gold-8201",
            image: "images/tap/tap-rose-gold-8201-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Rose Gold 8202",
            value: "tap-rose-gold-8202",
            image: "images/tap/tap-rose-gold-8202-large.webp",
          },
          {
            title: "Rose Gold 8301",
            value: "tap-rose-gold-8301",
            image: "images/tap/tap-rose-gold-8301-small.webp",
            hideIf: (choiceMap) => choiceMap["top"]?.value === "counter-top",
          },
          {
            title: "Rose Gold 8302",
            value: "tap-rose-gold-8302",
            image: "images/tap/tap-rose-gold-8302-large.webp",
          },
        ],
      },
      {
        title: "Handle",
        hideIf: (choiceMap) => !choiceMap.tap,
        type: "handle",
        choices: [
          {
            value: null,
            preserveSelection: true,
            title: "No handle",
            image: "images/nil-selection.webp",
          },
        ],
        groupChoices: [
          {
            hideIf: (choiceMap) => choiceMap.width?.value !== 50,
            name: "Handle - 50 cm",
            choices: [
              {
                value: "handle-chrome-50cm",
                title: "Chrome",
                image: "images/handle/vanity-cabinet-handle-chrome.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-chrome-60cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-chrome-80cm",
                  },
                ],
              },
              {
                value: "handle-gold-50cm",
                title: "Gold",
                image: "images/handle/vanity-cabinet-handle-gold.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-gold-60cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-gold-80cm",
                  },
                ],
              },
              {
                value: "handle-gun-metal-50cm",
                title: "Gun Metal",
                image: "images/handle/vanity-cabinet-handle-gun-metal.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-gun-metal-60cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-gun-metal-80cm",
                  },
                ],
              },
              {
                value: "handle-matt-black-50cm",
                title: "Matt Black",
                image: "images/handle/vanity-cabinet-handle-matt-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-matt-black-60cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-matt-black-80cm",
                  },
                ],
              },
              {
                value: "handle-rose-gold-50cm",
                title: "Rose Gold",
                image: "images/handle/vanity-cabinet-handle-rose-gold.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-rose-gold-60cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-rose-gold-80cm",
                  },
                ],
              },
            ],
          },
          {
            hideIf: (choiceMap) => choiceMap.width?.value !== 60,
            name: "Handle - 60 cm",
            choices: [
              {
                value: "handle-chrome-60cm",
                title: "Chrome",
                image: "images/handle/vanity-cabinet-handle-chrome.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-chrome-50cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-chrome-80cm",
                  },
                ],
              },
              {
                value: "handle-gold-60cm",
                title: "Gold",
                image: "images/handle/vanity-cabinet-handle-gold.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-gold-50cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-gold-80cm",
                  },
                ],
              },
              {
                value: "handle-gun-metal-60cm",
                title: "Gun Metal",
                image: "images/handle/vanity-cabinet-handle-gun-metal.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-gun-metal-50cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-gun-metal-80cm",
                  },
                ],
              },
              {
                value: "handle-matt-black-60cm",
                title: "Matt Black",
                image: "images/handle/vanity-cabinet-handle-matt-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-matt-black-50cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-matt-black-80cm",
                  },
                ],
              },
              {
                value: "handle-rose-gold-60cm",
                title: "Rose Gold",
                image: "images/handle/vanity-cabinet-handle-rose-gold.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-rose-gold-50cm",
                  },
                  {
                    eventType: "width",
                    value: 80,
                    to: "handle-rose-gold-80cm",
                  },
                ],
              },
            ],
          },
          {
            name: "Handle - 80 cm",
            hideIf: (choiceMap) => choiceMap.width?.value !== 80,
            choices: [
              {
                value: "handle-chrome-80cm",
                title: "Chrome",
                image: "images/handle/vanity-cabinet-handle-chrome.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-chrome-50cm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-chrome-60cm",
                  },
                ],
              },
              {
                value: "handle-gold-80cm",
                title: "Gold",
                image: "images/handle/vanity-cabinet-handle-gold.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-gold-50cm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-gold-60cm",
                  },
                ],
              },
              {
                value: "handle-gun-metal-80cm",
                title: "Gun Metal",
                image: "images/handle/vanity-cabinet-handle-gun-metal.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-gun-metal-50cm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-gun-metal-60cm",
                  },
                ],
              },
              {
                value: "handle-matt-black-80cm",
                title: "Matt Black",
                image: "images/handle/vanity-cabinet-handle-matt-black.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-matt-black-50cm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-matt-black-60cm",
                  },
                ],
              },
              {
                value: "handle-rose-gold-80cm",
                title: "Rose Gold",
                image: "images/handle/vanity-cabinet-handle-rose-gold.webp",
                transition: [
                  {
                    eventType: "width",
                    value: 50,
                    to: "handle-rose-gold-50cm",
                  },
                  {
                    eventType: "width",
                    value: 60,
                    to: "handle-rose-gold-60cm",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Stand",
        type: "stand",
        hideIf: (choiceMap) => !choiceMap.handle,
        transition: [
          {
            eventType: "breadth",
            value: 40,
            to: null,
            preserveSelection: true,
          },
        ],
        choices: [
          {
            hideIf: (choiceMap) =>
              !(
                choiceMap.width?.value === 60 && choiceMap.breadth?.value !== 40
              ),
            title: "With Stand",
            value: "stand-60cm",
            transition: [
              {
                eventType: "width",
                value: 80,
                to: "stand-80cm",
              },
            ],
          },
          {
            hideIf: (choiceMap) =>
              !(
                choiceMap.width?.value === 80 && choiceMap.breadth?.value !== 40
              ),
            title: "With Stand",
            value: "stand-80cm",
            transition: [
              {
                eventType: "width",
                value: 60,
                to: "stand-60cm",
              },
            ],
          },
          {
            title: "Wall Mounted",
            value: null,
            preserveSelection: true,
          },
        ],
      },
    ],
  },
};

type PopUpInfo = {
  title: string;
  subtitle: string;
  buttonText: string;
  sections: Section[];
};

type Section = {
  title: string;
  subtitle?: string;
  type: ChoiceType;
  choices?: SectionChoice[];
  groupChoices?: ChoiceGroup[];
  hideIf?: (choiceMap: ChoiceMap) => boolean;
  transition?: Transition[];
};

type ChoiceGroup = {
  name?: string;
  hideIf?: (choiceMap: ChoiceMap) => boolean;
  choices: SectionChoice[];
};

type SectionChoice = {
  //eslint-disable-next-line
  value: any;
  preserveSelection?: boolean;
  title: string;
  subtitle?: string;
  image?: string;
  hideIf?: (choiceMap: ChoiceMap) => boolean;
  transition?: Transition[];
};

type Transition = {
  eventType: ChoiceType;
  // eslint-disable-next-line
  value?: any;
  to: any;
  preserveSelection?: boolean;
};

Object.values(PopUpInfos).forEach((popUpInfo) => {
  popUpInfo.sections.forEach((section) => {
    if (section.transition) {
      section.transition.forEach((transition) => {
        const callback = createCallbackFunction(transition, section);
        eventSystem.subscribe(transition.eventType, callback);
      });
    }
    section.choices?.forEach((choice) => {
      if (choice.transition) {
        choice.transition.forEach((transition) => {
          const callback = createCallbackFunction(transition, section, choice);
          eventSystem.subscribe(transition.eventType, callback);
        });
      }
    });
    section.groupChoices?.forEach((groupChoice) => {
      groupChoice.choices.forEach((choice) => {
        if (choice.transition) {
          choice.transition.forEach((transition) => {
            const callback = createCallbackFunction(
              transition,
              section,
              choice,
            );
            eventSystem.subscribe(transition.eventType, callback);
          });
        }
      });
    });
  });
});

function createCallbackFunction(
  transition: Transition,
  section: Section,
  choice?: SectionChoice,
): EventCallback {
  return (event, value) => {
    if (
      event === transition.eventType &&
      (!transition.value || new RegExp(`${transition.value}`).test(value))
    ) {
      const { choiceMap, addChoice } = useStore.getState();

      const eventSource = choice?.value || section.type;

      if (!choice || choiceMap[section.type]?.value === choice.value) {
        addChoice(
          {
            type: section.type,
            // eslint-disable-next-line
            value: transition.to as any,
            preserveSelection: transition.preserveSelection,
          },
          `transition/${transition.eventType}/${eventSource}`,
        );
      }
    }
  };
}

export default CustomizePopUp;
