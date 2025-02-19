/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

export const VanityCabinetProductSetId = 1;

export enum FurnitureType {
  Basin = 1,
  BasinTap = 2,
  BasinCounterTop = 3,
  VanityCabinet = 4,
  InsertBasin = 5,
  OverflowRing = 6,
  Popup = 7,
  Handle = 8,
  Stand = 9,
  Drawer = 10,
}

type Triplet = [number, number, number];

export type Furniture = {
  key: string;
  type: FurnitureType;
  name: string;
  path: string;
  size?: number;
  dimensions: Triplet;
  position?: Triplet;
  textureMap?: Partial<TextureMap>;
  materials?: Partial<MaterialMap>;
  variant?: Partial<FurnitureVariant>;
};

export type FurnitureVariant = {
  isHybrid: boolean;
  insertBasinThickness: InsertBasinThickness;
};

type InsertBasinThickness = "thick" | "thin";

export type TextureMap = {
  baseMap: string;
  normalMap: string;
  roughnessMap: string;
  metallicMap: string;
  aoMap: string;
  displacementMap: string;
  map: string; // diffuse map
};

export type MaterialMap = {
  color: number;
  metalness: number;
  roughness: number;
};

type ModalType = "shoppingCart" | "customize";

export type VanityCabinetChoice =
  | {
      type: "width";
      value: number;
      name: string;
    }
  | {
      type: "breadth";
      value: number;
      name: string;
    }
  | {
      type: "vanity-color";
      value: string;
      name: string;
    }
  | {
      type: "top";
      value: "insert-basin" | "counter-top";
      name: string;
    }
  | {
      type: "insert-basin";
      value: string;
      name: string;
    }
  | { type: "counter-top"; value: string; name: string }
  | {
      type: "basin";
      value: string;
      name: string;
    }
  | {
      type: "overflow-ring";
      value: string;
      name: string;
    }
  | {
      type: "popup";
      value: string;
      name: string;
    }
  | {
      type: "tap";
      value: string;
      name: string;
    }
  | {
      type: "handle";
      value: string;
      name: string;
    }
  | {
      type: "stand";
      value: string;
      name: string;
    }
  | {
      type: "drawer";
      value: boolean;
      name: string;
    };

const choiceTypeToFurnitureTypeMap: Partial<Record<ChoiceType, FurnitureType>> =
  {
    "vanity-color": FurnitureType.VanityCabinet,
    "insert-basin": FurnitureType.InsertBasin,
    "counter-top": FurnitureType.BasinCounterTop,
    basin: FurnitureType.Basin,
    "overflow-ring": FurnitureType.OverflowRing,
    popup: FurnitureType.Popup,
    tap: FurnitureType.BasinTap,
    handle: FurnitureType.Handle,
    stand: FurnitureType.Stand,
    drawer: FurnitureType.Drawer,
  };

export type ChoiceType = VanityCabinetChoice["type"];
export type Choice = VanityCabinetChoice;
export type ChoiceMap = Partial<Record<ChoiceType, Choice>>;

export type Config = {
  furnitureMap: FurnitureMap;
  choiceMap: ChoiceMap;
  productSetId: number;
};

type SyncedData = {
  config: Record<number, Config>;
  metadata: ConfigMetadata;
};

export type ConfigMetadata = {
  feeMap: Record<string, boolean>;
};

export type FurnitureMap = Partial<Record<FurnitureType, Furniture>>;

type StoreState = {
  currentProductSetId: number;
  setCurrentProductSetId: (id: number) => void;
  showDimension: boolean;
  toggleShowDimension: () => void;
  modals: Record<ModalType, boolean>;
  setModal: (modal: ModalType, open: boolean) => void;
  cartItems: Omit<Furniture, "position" | "dimensions">[];
  addToCart: (id: string) => void;
  removeFromCart: (type: FurnitureType) => void;
  clearCart: () => void;

  config: Record<number, Config>;
  sync: (serverData: SyncedData) => void;

  setFurnitureDimensions: (
    productSetId: number,
    type: FurnitureType,
    dimensions: Triplet,
  ) => void;
  setFurniturePosition: (
    productSetId: number,
    type: FurnitureType,
    position: Triplet,
  ) => void;

  customizePopUpKey: string;
  setCustomizePopUpKey: (key: string) => void;

  addChoice: (
    productSetId: number,
    choice: {
      type: Choice["type"];
      value: any;
      name: string;
      preserveSelection?: boolean;
      skipFurniture?: boolean;
    },
    source?: string,
  ) => void;
  fees: Fee[];
  addFee: (fee: Fee) => void;
  removeFee: (type: FeeType) => void;
};

type Fee = {
  name: string;
  price: number;
  type: FeeType;
};

export type FeeType = "delivery" | "installation";

export const deliveryFee: Fee = {
  name: "Free Delivery (above $500)",
  type: "delivery",
  price: 0, // free above $500
};
export const installationFee: Fee = {
  name: "Installation",
  type: "installation",
  price: 180,
};

export const allFees = [deliveryFee, installationFee];

export const allFurnitures: Omit<Furniture, "dimensions">[] = [
  // Counter Top
  {
    key: "counter-top-birch-600mm",
    name: "Countertop Birch 60cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-600mm.glb",
    size: 600,
    textureMap: {
      map: "/images/maps/vanity-cabinet/Birch.png",
    },
  },
  {
    key: "counter-top-brownstone-600mm",
    name: "Countertop Brown Stone 60cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-600mm.glb",
    size: 600,
    textureMap: {
      map: "/images/maps/vanity-cabinet/Brown-Stone.png",
    },
  },
  {
    key: "counter-top-charcoal-ash-600mm",
    name: "Countertop Charcoal Ash 60cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-600mm.glb",
    size: 600,
    textureMap: {
      map: "/images/maps/vanity-cabinet/Charcoal-Ash.png",
    },
  },
  {
    key: "counter-top-oakwood-600mm",
    name: "Countertop Oakwood 60cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-600mm.glb",
    size: 600,
    textureMap: {
      map: "/images/maps/vanity-cabinet/Oakwood.png",
    },
  },
  {
    key: "counter-top-black-600mm",
    name: "Countertop Black Quartz 60cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/Quartzstone-countertop-lightcolour-600mm.glb",
    size: 600,
    textureMap: {
      map: "/images/maps/black-quartz-600mm-countertop-diffused.webp",
      roughnessMap: "/images/maps/black-quartz-600mm-countertop-roughness.webp",
    },
  },
  {
    key: "counter-top-white-600mm",
    name: "Countertop White Quartz 60cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/Quartzstone-countertop-lightcolour-600mm.glb",
    size: 600,
    textureMap: {
      map: "/images/maps/white-quartz-600mm-countertop-diffused.webp",
      roughnessMap: "/images/maps/white-quartz-600mm-countertop-roughness.webp",
    },
  },

  {
    key: "counter-top-birch-800mm",
    name: "Countertop Birch 80cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-800mm.glb",
    size: 800,
    textureMap: {
      map: "/images/maps/vanity-cabinet/Birch.png",
    },
  },
  {
    key: "counter-top-brownstone-800mm",
    name: "Countertop Brownstone 80cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-800mm.glb",
    size: 800,
    textureMap: {
      map: "/images/maps/vanity-cabinet/Brown-Stone.png",
    },
  },
  {
    key: "counter-top-charcoal-ash-800mm",
    name: "Countertop Charcoal Ash 80cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Charcoal-Ash.png",
    },
  },
  {
    key: "counter-top-oakwood-800mm",
    name: "Countertop Oakwood 80cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/counter-top/countertop-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Oakwood.png",
    },
  },
  {
    key: "counter-top-black-800mm",
    name: "Countertop Black Quartz 80cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/Quartzstone-countertop-lightcolour-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/black-quartz-800mm-countertop-diffused.webp",
      roughnessMap: "/images/maps/black-quartz-800mm-countertop-roughness.webp",
    },
  },
  {
    key: "counter-top-white-800mm",
    name: "Countertop White Quartz 80cm",
    type: FurnitureType.BasinCounterTop,
    path: "/models/Quartzstone-countertop-lightcolour-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/white-quartz-800mm-countertop-diffused.webp",
      roughnessMap: "/images/maps/white-quartz-800mm-countertop-roughness.webp",
    },
  },

  // Vanity Cabinet
  {
    key: "vanity-cabinet-birch-600mm",
    name: "Vanity Cabinet Birch 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Birch.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-blanco-600mm",
    name: "Vanity Cabinet Blanco 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Blanco.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-brown-stone-600mm",
    name: "Vanity Cabinet Brown Stone 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Brown-Stone.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-charcoal-ash-600mm",
    name: "Vanity Cabinet Charcoal Ash 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Charcoal-Ash.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-matt-black-600mm",
    name: "Vanity Cabinet Matt Black 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Matt-Black.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-graphite-600mm",
    name: "Vanity Cabinet Graphite 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Graphite.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-oakwood-600mm",
    name: "Vanity Cabinet Oakwood 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Oakwood.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-birch-800mm",
    name: "Vanity Cabinet Birch 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Birch.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-blanco-800mm",
    name: "Vanity Cabinet Blanco 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Blanco.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-brown-stone-800mm",
    name: "Vanity Cabinet Brown Stone 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Brown-Stone.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-charcoal-ash-800mm",
    name: "Vanity Cabinet Charcoal Ash 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Charcoal-Ash.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-graphite-800mm",
    name: "Vanity Cabinet Graphite 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Graphite.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-matt-black-800mm",
    name: "Vanity Cabinet Matt Black 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Matt-Black.png",
    },

    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-oakwood-800mm",
    name: "Vanity Cabinet Oakwood 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,

    textureMap: {
      map: "/images/maps/vanity-cabinet/Oakwood.png",
    },

    variant: {
      isHybrid: false,
    },
  },

  // hybrid vanity cabinet
  {
    key: "vanity-cabinet-hybrid-pebble-500mm",
    name: "Vanity Cabinet Hybrid Pebble 50cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pebble-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pine-500mm",
    name: "Vanity Cabinet Hybrid Pine 50cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pine-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-walnut-500mm",
    name: "Vanity Cabinet Hybrid Walnut 50cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Walnut-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pebble-600mm",
    name: "Vanity Cabinet Hybrid Pebble 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pebble-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pine-600mm",
    name: "Vanity Cabinet Hybrid Pine 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pine-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-walnut-600mm",
    name: "Vanity Cabinet Hybrid Walnut 60cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Walnut-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },

  {
    key: "vanity-cabinet-hybrid-pebble-800mm",
    name: "Vanity Cabinet Hybrid Pebble 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pebble-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pine-800mm",
    name: "Vanity Cabinet Hybrid Pine 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pine-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-walnut-800mm",
    name: "Vanity Cabinet Hybrid Walnut 80cm",
    type: FurnitureType.VanityCabinet,
    path: "/models/vanity-cabinet/Vanity-Cabinet-Hybrid-Walnut-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
    },
    textureMap: {},

    position: [0, 0, 0],
  },

  // insert basin
  {
    key: "insert-basin-ceramic-600mm",
    name: "Insert Basin Ceramic 60cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Ceramic-600mm.glb",
    size: 600,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thin",
    },
  },
  {
    key: "insert-basin-glass-black-600mm",
    name: "Insert Basin Glass Black 60cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-Black-600mm.glb",
    size: 600,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
  },
  {
    key: "insert-basin-glass-white-600mm",
    name: "Insert Basin Glass White 60cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-White-600mm.glb",
    size: 600,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
  },
  {
    key: "insert-basin-ceramic-800mm",
    name: "Insert Basin Ceramic 80cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Ceramic-800mm.glb",
    size: 800,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thin",
    },
  },
  {
    key: "insert-basin-glass-black-800mm",
    name: "Insert Basin Glass Black 80cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-Black-800mm.glb",
    size: 800,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
  },
  {
    key: "insert-basin-glass-white-800mm",
    name: "Insert Basin Glass White 80cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-White-800mm.glb",
    size: 800,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
  },

  // hybrid insert basin
  {
    key: "insert-basin-hybrid-ceramic-500mm",
    name: "Insert Basin Ceramic Hybrid 50cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Ceramic-Hybrid-50cm.glb",
    size: 500,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thick",
    },
  },
  {
    key: "insert-basin-hybrid-glass-black-500mm",
    name: "Insert Basin Glass Black 50cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-Black-Hybrid-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
  },
  {
    key: "insert-basin-hybrid-glass-white-500mm",
    name: "Insert Basin Glass White 50cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-White-Hybrid-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
  },
  {
    key: "insert-basin-hybrid-ceramic-600mm",
    name: "Insert Basin Ceramic 60cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Ceramic-Hybrid-60cm.glb",
    size: 600,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thick",
    },
  },
  {
    key: "insert-basin-hybrid-glass-black-600mm",
    name: "Insert Basin Glass Black 60cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-Black-Hybrid-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
  },
  {
    key: "insert-basin-hybrid-glass-white-600mm",
    name: "Insert Basin White Glass 60cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-White-Hybrid-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
  },
  {
    key: "insert-basin-hybrid-ceramic-800mm",
    name: "Insert Basin Ceramic 80cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Ceramic-Hybrid-80cm.glb",
    size: 800,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thick",
    },
  },
  {
    key: "insert-basin-hybrid-glass-black-800mm",
    name: "Insert Basin Glass Black 80cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-Black-Hybrid-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
  },
  {
    key: "insert-basin-hybrid-glass-white-800mm",
    name: "Insert Basin Glass White 80cm",
    type: FurnitureType.InsertBasin,
    path: "/models/insert-basin/Insert-Basin-Glass-White-Hybrid-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
  },

  // basin
  {
    key: "basin-rectangular-ceramic-blush",
    name: "Basin Rectangular Ceramic Blush",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Blush.png",
    },
    materials: {
      color: 0xeeb5ac,
      metalness: 0.3,
      roughness: 0.35,
    },
  },
  {
    key: "basin-rectangular-ceramic-eclair",
    name: "Basin Rectangular Ceramic Eclair",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Eclair.png",
    },
    materials: {
      color: 0x473930,
      metalness: 0.3,
      roughness: 0.2,
    },
  },
  {
    key: "basin-rectangular-ceramic-matt-black",
    name: "Basin Rectangular Matt Black",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Matt-Black.png",
    },
    materials: {
      color: 0x1d1d1d,
      metalness: 0.3,
      roughness: 0.35,
    },
  },
  {
    key: "basin-rectangular-ceramic-matt-white",
    name: "Basin Rectangular Matte White ",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Matt-White.png",
    },
    materials: {
      color: 0xf8f8f7,
      metalness: 0.3,
      roughness: 0.35,
    },
  },
  {
    key: "basin-rectangular-ceramic-mocha",
    name: "Basin Rectangular Ceramic Mocha",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Mocha.png",
    },
    materials: {
      color: 0xb9ada4,
      metalness: 0.3,
      roughness: 0.35,
    },
  },
  {
    key: "basin-rectangular-ceramic-moss",
    name: "Basin Rectangular Ceramic Moss",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Moss.png",
    },
    materials: {
      color: 0x044947,
      metalness: 0,
      roughness: 0.3,
    },
  },
  {
    key: "basin-rectangular-ceramic-slate-grey",
    name: "Basin Rectangular Ceramic Slate Grey",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Slate-Grey.png",
    },
    materials: {
      color: 0x626669,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-rectangular-ceramic-storm",
    name: "Basin Rectangular Ceramic Storm",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Storm.png",
    },
    materials: {
      color: 0x747b89,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-rectangular-ceramic-teal",
    name: "Basin Rectangular Ceramic Teal",
    type: FurnitureType.Basin,
    path: "/models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Teal.png",
    },
    materials: {
      color: 0x5c716e,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-round-ceramic-blush",
    name: "Basin Round Ceramic Blush",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Blush.png",
    },
    materials: {
      color: 0xeeb5ac,
      metalness: 0.3,
      roughness: 0.6,
    },
  },
  {
    key: "basin-round-ceramic-matt-black",
    name: "Basin Round Ceramic Matt Black",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Matt-Black.png",
    },
    materials: {
      color: 0x1d1d1d,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-round-ceramic-matt-white",
    name: "Basin Round Ceramic Matt White",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Matt-White.png",
    },
    materials: {
      color: 0xf8f8f7,
      metalness: 0.3,
      roughness: 0.6,
    },
  },
  {
    key: "basin-round-ceramic-mint",
    name: "Basin Round Ceramic Mint",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Mint.png",
    },
    materials: {
      color: 0x8ba28f,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-round-ceramic-mocha",
    name: "Basin Round Ceramic Mocha",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Mocha.png",
    },
    materials: {
      color: 0xb9ada4,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-round-ceramic-slate-grey",
    name: "Basin Round Ceramic Slate Grey",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Slate-Grey.png",
    },
    materials: {
      color: 0x626669,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-round-ceramic-stone-grey",
    name: "Basin Round Ceramic Stone Grey",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Stone-Grey.png",
    },
    materials: {
      color: 0x9b9a94,
      metalness: 0,
      roughness: 0.35,
    },
  },
  {
    key: "basin-round-ceramic-tangerine",
    name: "Round Ceramic Basin Tangerine",
    type: FurnitureType.Basin,
    path: "/models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "/images/maps/basin/Basin-Tangerine.png",
    },
    materials: {
      color: 0xcf6f3d,
      metalness: 0.3,
      roughness: 0.6,
    },
  },

  // overflow-ring
  {
    key: "basin-overflow-ring-chrome",
    name: "Overflow Ring Chrome",
    type: FurnitureType.OverflowRing,
    path: "/models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "basin-overflow-ring-gold",
    name: "Overflow Ring Gold",
    type: FurnitureType.OverflowRing,
    path: "/models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "basin-overflow-ring-gun-metal",
    name: "Overflow Ring Gun Metal",
    type: FurnitureType.OverflowRing,
    path: "/models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "basin-overflow-ring-matt-black",
    name: "Overflow Ring Matt Black",
    type: FurnitureType.OverflowRing,
    path: "/models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "basin-overflow-ring-rose-gold",
    name: "Overflow Ring Rose Gold",
    type: FurnitureType.OverflowRing,
    path: "/models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },

  // popup
  {
    key: "popup-chrome",
    name: "Popup Chrome",
    type: FurnitureType.Popup,
    path: "/models/popup/popup.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "popup-gold",
    name: "Popup Gold",
    type: FurnitureType.Popup,
    path: "/models/popup/popup.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "popup-gun-metal",
    name: "Popup Gun Metal",
    type: FurnitureType.Popup,
    path: "/models/popup/popup.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "popup-matt-black",
    name: "Popup Matt Black",
    type: FurnitureType.Popup,
    path: "/models/popup/popup.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "popup-rose-gold",
    name: "Popup Rose Gold",
    type: FurnitureType.Popup,
    path: "/models/popup/popup.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },

  // tap
  {
    key: "tap-chrome-8101",
    name: "Tap Chrome 8101",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8101.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-chrome-8102",
    name: "Tap Chrome 8102",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8102.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-chrome-8201",
    name: "Tap Chrome 8201",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8201.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-chrome-8202",
    name: "Tap Chrome 8202",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8202.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-chrome-8301",
    name: "Tap Chrome 8301",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8301.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-chrome-8302",
    name: "Tap Chrome 8302",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8302.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-gun-metal-8101",
    name: "Tap Gun Metal 8101",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8101.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-gun-metal-8102",
    name: "Tap Gun Metal 8102",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8102.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-gun-metal-8201",
    name: "Tap Gun Metal 8201",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8201.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-gun-metal-8202",
    name: "Tap Gun Metal 8202",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8202.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-gun-metal-8301",
    name: "Tap Gun Metal 8301",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8301.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-gun-metal-8302",
    name: "Tap Gun Metal 8302",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8302.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-black-8101",
    name: "Tap Matt Black 8101",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8101.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-black-8102",
    name: "Tap Matt Black 8102",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8102.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-black-8201",
    name: "Tap Matt Black 8201",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8201.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-black-8202",
    name: "Tap Matt Black 8202",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8202.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-black-8301",
    name: "Tap Matt Black 8301",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8301.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-black-8302",
    name: "Tap Matt Black 8302",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8302.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-gold-8101",
    name: "Tap Matt Gold 8101",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8101.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-gold-8102",
    name: "Tap Matt Gold 8102",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8102.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-gold-8201",
    name: "Tap Matt Gold 8201",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8201.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-gold-8202",
    name: "Tap Matt Gold 8202",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8202.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-gold-8301",
    name: "Tap Matt Gold 8301",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8301.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-matt-gold-8302",
    name: "Tap Matt Gold 8302",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8302.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-rose-gold-8101",
    name: "Tap Rose Gold 8101",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8101.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-rose-gold-8102",
    name: "Tap Rose Gold 8102",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8102.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-rose-gold-8201",
    name: "Tap Rose Gold 8201",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8201.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-rose-gold-8202",
    name: "Tap Rose Gold 8202",
    type: FurnitureType.BasinTap,
    path: "/models/tap/tap-8202.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-rose-gold-8301",
    name: "Tap Rose Gold 8301",
    path: "/models/tap/tap-8301.glb",
    type: FurnitureType.BasinTap,
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "tap-rose-gold-8302",
    name: "Tap Rose Gold 8302",
    path: "/models/tap/tap-8302.glb",
    type: FurnitureType.BasinTap,
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },

  // handle
  {
    key: "handle-chrome-50cm",
    name: "Handle Chrome",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-gold-50cm",
    name: "Handle Gold",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-gun-metal-50cm",
    name: "Handle Gun Metal",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-matt-black-50cm",
    name: "Handle Matt Black",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-rose-gold-50cm",
    name: "Handle Rose Gold",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-chrome-60cm",
    name: "Handle Chrome",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-gold-60cm",
    name: "Handle Gold",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-gun-metal-60cm",
    name: "Handle Gun Metal",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-matt-black-60cm",
    name: "Handle Matt Black",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-rose-gold-60cm",
    name: "Handle Rose Gold",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-chrome-80cm",
    name: "Handle Chrome",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-gold-80cm",
    name: "Handle Gold",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-gun-metal-80cm",
    name: "Handle Gun Metal",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-matt-black-80cm",
    name: "Handle Matt Black",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
  },
  {
    key: "handle-rose-gold-80cm",
    name: "Handle Rose Gold",
    type: FurnitureType.Handle,
    path: "/models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
  },

  // stand
  {
    key: "stand-60cm",
    name: "Stand 60cm",
    type: FurnitureType.Stand,
    path: "/models/stand/Vanity-Cabinet-Stand-600mm.glb",
  },
  {
    key: "stand-80cm",
    name: "Stand 80cm",
    type: FurnitureType.Stand,
    path: "/models/stand/Vanity-Cabinet-Stand-800mm.glb",
  },

  {
    key: "inner-drawer",
    name: "Drawer",
    type: FurnitureType.Drawer,
    path: "",
  },
];

const defaultFurnitures = {
  [FurnitureType.VanityCabinet]: "vanity-cabinet-birch-600mm",
  [FurnitureType.InsertBasin]: "insert-basin-ceramic-600mm",
  [FurnitureType.OverflowRing]: "basin-overflow-ring-chrome",
  [FurnitureType.Popup]: "popup-chrome",
  [FurnitureType.BasinTap]: "tap-chrome-8101",
  [FurnitureType.Handle]: "handle-chrome-60cm",
  [FurnitureType.Stand]: "stand-60cm",
};

const defaultChoiceMap = {
  breadth: { type: "breadth", value: 46, name: "Breadth 46" },
  width: { type: "width", value: 60, name: "Width 60" },
  "vanity-color": {
    type: "vanity-color",
    value: defaultFurnitures[FurnitureType.VanityCabinet],
    name: "Birch",
  },
  top: {
    type: "top",
    value: "insert-basin",
    name: "Insert Basin",
  },
  "insert-basin": {
    type: "insert-basin",
    value: defaultFurnitures[FurnitureType.InsertBasin],
    name: "Ceramic",
  },
  "overflow-ring": {
    type: "overflow-ring",
    value: defaultFurnitures[FurnitureType.OverflowRing],
    name: "Chrome",
  },
  popup: {
    type: "popup",
    value: defaultFurnitures[FurnitureType.Popup],
    name: "Popup Chrome",
  },
  tap: {
    type: "tap",
    value: defaultFurnitures[FurnitureType.BasinTap],
    name: "Tap Chrome 8101",
  },
  handle: {
    type: "handle",
    value: defaultFurnitures[FurnitureType.Handle],
    name: "Handle Chrome 60cm",
  },
  stand: {
    type: "stand",
    value: defaultFurnitures[FurnitureType.Stand],
    name: "Stand 60cm",
  },
} satisfies ChoiceMap;

function isFurnitureType(key: any): key is keyof typeof defaultFurnitures {
  return Object.keys(defaultFurnitures).includes(key);
}

const useStore = create<StoreState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      showDimension: false,
      toggleShowDimension: () =>
        set(
          (state) => {
            return {
              ...state,
              showDimension: !state.showDimension,
            };
          },
          undefined,
          {
            type: "toggleShowDimension",
          },
        ),
      currentProductSetId: 0,
      setCurrentProductSetId(id) {
        set({ currentProductSetId: id }, undefined, {
          type: "setCurrentProductSetId",
          payload: id,
        });
      },
      modals: {
        shoppingCart: false,
        customize: false,
      },
      cartItems: [],
      addToCart: (id: string) => {
        const furniture = allFurnitures.find(
          (furniture) => furniture.key === id,
        );
        if (!furniture) {
          return;
        }

        set((state) => {
          return {
            ...state,
            cartItems: [...state.cartItems, furniture],
          };
        });
      },
      removeFromCart: (type: FurnitureType) => {
        set((state) => {
          return {
            ...state,
            cartItems: state.cartItems.filter((item) => item.type !== type),
          };
        });
      },
      clearCart: () => set({ cartItems: [] }),
      setModal: (modal: string, open: boolean) => {
        set((state) => {
          return {
            ...state,
            modals: {
              ...state.modals,
              [modal]: open,
            },
          };
        });
      },
      config: {
        [VanityCabinetProductSetId]: {
          productSetId: VanityCabinetProductSetId,
          furnitureMap: Object.keys(defaultFurnitures).reduce<FurnitureMap>(
            (acc, type) => {
              const furniture = allFurnitures.find((furniture) => {
                if (!isFurnitureType(type)) {
                  return false;
                }

                return furniture.key === defaultFurnitures[type];
              });

              return {
                ...acc,
                [type]: {
                  ...{ dimensions: [0, 0, 0] as Triplet },
                  ...furniture,
                },
              };
            },
            {},
          ),
          choiceMap: defaultChoiceMap,
        },
      },
      sync: (syncedData) => {
        const fees = Object.entries(syncedData.metadata.feeMap).flatMap(
          ([type, feeIncluded]) => {
            return allFees.filter((fee) => fee.type === type && feeIncluded);
          },
        );

        set(
          {
            fees,
            config: syncedData.config,
          },
          undefined,
          { type: "sync", payload: syncedData },
        );
      },

      setFurnitureDimensions: (productSetId: number, type, dimensions) => {
        set(
          (state) => {
            return {
              config: {
                ...state.config,
                [productSetId]: {
                  ...state.config[productSetId],
                  furnitureMap: {
                    ...state.config[productSetId].furnitureMap,
                    [type]: {
                      ...state.config[productSetId].furnitureMap[type],
                      dimensions,
                    },
                  },
                },
              },
            };
          },
          undefined,
          { type: "setFurnitureDimensions", payload: { type, dimensions } },
        );
      },
      setFurniturePosition: (productSetId: number, type, position) => {
        set(
          (state) => {
            return {
              config: {
                ...state.config,
                [productSetId]: {
                  ...state.config[productSetId],
                  furnitureMap: {
                    ...state.config[productSetId].furnitureMap,
                    [type]: {
                      ...state.config[productSetId].furnitureMap[type],
                      position,
                    },
                  },
                },
              },
            };
          },
          undefined,
          {
            type: "setFurniturePosition",
            payload: { type, position },
          },
        );
      },

      customizePopUpKey: "",
      setCustomizePopUpKey: (key: string) => set({ customizePopUpKey: key }),

      addChoice: (productSetId, choice, source = "") => {
        eventSystem.dispatch(choice.type, choice.value);

        const furnitureType = choiceTypeToFurnitureTypeMap[choice.type];
        const currentState = get();
        const newFurnitureMap = {
          ...currentState.config[productSetId].furnitureMap,
        };
        const newChoiceMap = { ...currentState.config[productSetId].choiceMap };

        if (furnitureType && !choice.skipFurniture) {
          const furniture = allFurnitures.find(
            (furniture) => furniture.key === choice.value,
          );
          if (choice.value === null) {
            delete newFurnitureMap[furnitureType];
          } else if (furniture) {
            newFurnitureMap[furnitureType] = {
              ...{ dimensions: [0, 0, 0] as Triplet },
              ...currentState.config[productSetId].furnitureMap[furnitureType],
              ...furniture,
            };
          } else {
            console.warn("Furniture not found", choice.value);
          }
        }

        if (choice.value === null && !choice.preserveSelection) {
          delete newChoiceMap[choice.type];
        } else {
          newChoiceMap[choice.type] = {
            type: choice.type,
            value: choice.value,
            name: choice.name,
          };
        }

        set(
          {
            config: {
              ...currentState.config,
              [productSetId]: {
                ...currentState.config[productSetId],
                furnitureMap: newFurnitureMap,
                choiceMap: newChoiceMap,
              },
            },
          },
          undefined,
          { type: "addChoice", payload: { choice, source } },
        );
      },
      fees: [],
      addFee: (fee: Fee) => {
        const feeByType = new Map(get().fees.map((fee) => [fee.type, fee]));
        if (!feeByType.has(fee.type)) {
          set(
            (state) => {
              return {
                fees: [...state.fees, fee],
              };
            },
            undefined,
            { type: "addFee", payload: fee },
          );
        }
      },
      removeFee: (type: FeeType) => {
        set(
          (state) => {
            return {
              fees: state.fees.filter((fee) => fee.type !== type),
            };
          },
          undefined,
          { type: "removeFee", payload: type },
        );
      },
    })),
  ),
);

export type EventCallback = (event: ChoiceType, value: any) => void;

export class EventSystem {
  listeners: Record<string, EventCallback[]> = {};

  subscribe(event: ChoiceType, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  unsubscribe(event: ChoiceType, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback,
    );
  }

  dispatch(event: ChoiceType, value: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => callback(event, value));
  }
}

export const eventSystem = new EventSystem();

export const useCartItems = () => {
  const configs = useStore((state) => state.config);

  const furnitureTypeIncluded = new Map<FurnitureType, boolean>();
  const cartItems: CartItem[] = [];

  for (const config of Object.values(configs)) {
    const { choiceMap, furnitureMap } = config;
    switch (config.productSetId) {
      case VanityCabinetProductSetId: {
        let vanityCabinet: CartItem | undefined = undefined;
        const vanityChoice = choiceMap["vanity-color"];
        if (vanityChoice) {
          const furnitureType = choiceTypeToFurnitureTypeMap["vanity-color"];
          if (furnitureType) {
            const furniture = furnitureMap[furnitureType];
            furnitureTypeIncluded.set(furnitureType, true);
            if (furniture) {
              vanityCabinet = {
                key: furniture.key,
                name: furniture.name,
                price: calculatePrice(choiceMap, 1 << furnitureType),
              };
            }
          }
        }

        if (vanityCabinet) {
          const handle = choiceMap.handle;
          const overflowRing = choiceMap["overflow-ring"];
          const popup = choiceMap.popup;
          const insertBasin = choiceMap["insert-basin"];
          const counterTop = choiceMap["counter-top"];

          for (const choice of [
            handle,
            overflowRing,
            popup,
            insertBasin,
            counterTop,
          ]) {
            if (!choice) {
              continue;
            }

            const furnitureType = choiceTypeToFurnitureTypeMap[choice.type];

            if (furnitureType) {
              furnitureTypeIncluded.set(furnitureType, true);

              const furniture = furnitureMap[furnitureType];
              if (furniture) {
                vanityCabinet.children = [
                  ...(vanityCabinet.children || []),
                  {
                    key: furniture.key,
                    name: furniture.name,
                    price: calculatePrice(choiceMap, 1 << furnitureType),
                  },
                ];
              }
            }
          }
          cartItems.push(vanityCabinet);
        }
        const keys = Object.keys(choiceMap) as ChoiceType[];

        for (const key of keys) {
          const furnitureType = choiceTypeToFurnitureTypeMap[key];

          if (furnitureType && !furnitureTypeIncluded.has(furnitureType)) {
            const furniture = furnitureMap[furnitureType];
            if (furniture) {
              cartItems.push({
                key: furniture.key,
                name: furniture.name,
                price: calculatePrice(choiceMap, 1 << furnitureType),
              });
            } else if (choiceMap[key]?.value !== null) {
              // some choices have no associated furniture
              cartItems.push({
                key: choiceMap[key]?.value as any,
                name: choiceMap[key]?.name ?? "",
                price: calculatePrice(choiceMap, 1 << furnitureType),
              });
            }
          }
        }
        break;
      }
      default:
        console.warn("Unknown product set id", config.productSetId);
    }
  }

  return cartItems;
};

export const useTotalPrice = () => {
  const { config, fees } = useStore();

  const totalItemPrice = Object.values(config).reduce((total, configValues) => {
    return total + calculatePrice(configValues.choiceMap, 0);
  }, 0);

  const feePrice = fees.reduce((acc, fee) => acc + fee.price, 0);
  return totalItemPrice + feePrice;
};

function calculatePrice(choiceMap: ChoiceMap, furnitureTypeBitMask: number) {
  let price = 0;

  if (
    furnitureTypeBitMask & (1 << FurnitureType.VanityCabinet) ||
    furnitureTypeBitMask === 0
  ) {
    price += calculateVanityCabinetPrice("", choiceMap);
  }

  if (
    furnitureTypeBitMask & (1 << FurnitureType.BasinTap) ||
    furnitureTypeBitMask === 0
  ) {
    price += calculateTapPrice(String(choiceMap.tap?.value));
  }

  if (
    furnitureTypeBitMask & (1 << FurnitureType.Basin) ||
    furnitureTypeBitMask === 0
  ) {
    price += calculateBasinPrice(String(choiceMap["basin"]?.value), choiceMap);
  }

  if (
    furnitureTypeBitMask & (1 << FurnitureType.Stand) ||
    furnitureTypeBitMask === 0
  ) {
    price += calculateStandPrice((choiceMap.stand?.value as string) ?? "");
  }

  if (
    furnitureTypeBitMask & (1 << FurnitureType.Drawer) ||
    furnitureTypeBitMask === 0
  ) {
    price += calculateDrawerPrice(choiceMap.drawer?.value as string, choiceMap);
  }

  return price;
}

export function calculateTapPrice(tap: string) {
  if (tap.includes("8101") || tap.includes("8201") || tap.includes("8301")) {
    return 228;
  } else if (
    tap.includes("8102") ||
    tap.includes("8202") ||
    tap.includes("8302")
  ) {
    return 288;
  }

  return 0;
}

export function calculateBasinPrice(basin: string, choiceMap: ChoiceMap) {
  if (choiceMap.top?.value === "counter-top") {
    if (basin.includes("rectangular")) {
      return 268;
    } else if (basin.includes("round")) {
      return 268;
    }
  }
  return 0;
}

export function calculateVanityCabinetPrice(_: string, choiceMap: ChoiceMap) {
  if (choiceMap.breadth?.value === 46) {
    if (choiceMap.width?.value === 60) {
      return 748;
    } else if (choiceMap.width?.value === 80) {
      return 848;
    }
  } else if (choiceMap.breadth?.value === 40) {
    if (choiceMap.width?.value === 50) {
      return 648;
    } else if (choiceMap.width?.value === 60) {
      return 748;
    } else if (choiceMap.width?.value === 80) {
      return 848;
    }
  }

  return 0;
}

export function calculateStandPrice(val: string | undefined) {
  if (val) {
    return 98;
  }

  return 0;
}

export function calculateDrawerPrice(
  val: string | undefined,
  choiceMap: ChoiceMap,
) {
  if (val) {
    if (choiceMap.width?.value === 60) {
      return 138;
    } else if (choiceMap.width?.value === 80) {
      return 178;
    }
  }
  return 0;
}

type CartItem = {
  key: string;
  name: string;
  price: number;
  children?: CartItem[];
};

export default useStore;
