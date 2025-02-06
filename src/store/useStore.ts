/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum FurnitureType {
  Basin = 1,
  BasinTap = 2,
  BasinCounterTop = 3,
  VanityCabinet = 4,
  InsertBasin = 5,
  OverflowRing = 6,
  Popup = 7,
  Handle = 8,
  Tap = 9,
}

type Triplet = [number, number, number];

export type Furniture = {
  key: string;
  type: FurnitureType;
  name: string;
  path: string;
  size: number;
  dimensions: Triplet;
  position?: Triplet;
  minPackageTier: PackageType;
  textureMap?: Partial<TextureMap>;
  variant?: Partial<FurnitureVariant>;
  price: number;
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

type TextureObject = {
  key: string;
  name: string;
  path?: string;
  maps?: Partial<TextureMap>;
  baseColor?: string;
};

type TextureObjectType = "floor" | "wall" | "ceiling";

type ModalType = "shoppingCart" | "customize";

type PackageType = "default" | "enhanced" | "premium" | "luxury";

export type VanityCabinetChoice =
  | {
      type: "width";
      value: number;
    }
  | {
      type: "breadth";
      value: number;
    }
  | {
      type: "vanity-color";
      value: string;
    }
  | {
      type: "top";
      value: "insert-basin" | "counter-top";
    }
  | {
      type: "insert-basin";
      value: string;
    }
  | { type: "counter-top"; value: string }
  | {
      type: "basin";
      value: string;
    }
  | {
      type: "overflow-ring";
      value: string;
    }
  | {
      type: "popup";
      value: string;
    }
  | {
      type: "tap";
      value: string;
    }
  | {
      type: "handle";
      value: string;
    }
  | {
      type: "stand";
      value: "wall-mount" | "with-stand";
    };

const choiceTypeToFurnitureTypeMap: Partial<Record<ChoiceType, FurnitureType>> =
  {
    "vanity-color": FurnitureType.VanityCabinet,
    "insert-basin": FurnitureType.InsertBasin,
    "counter-top": FurnitureType.BasinCounterTop,
    basin: FurnitureType.Basin,
    "overflow-ring": FurnitureType.OverflowRing,
    popup: FurnitureType.Popup,
    tap: FurnitureType.Tap,
    handle: FurnitureType.Handle,
  };

export type ChoiceType = VanityCabinetChoice["type"];
export type Choice = VanityCabinetChoice;
export type ChoiceMap = Partial<Record<ChoiceType, Choice>>;

type FurnitureMap = Partial<Record<FurnitureType, Omit<Furniture, "price">>>;

type StoreState = {
  package: PackageType;
  setPackage: (p: string) => void;
  roomDimensions: {
    depth: number;
    length: number;
    height: number;
  };
  textures: { [key in TextureObjectType]: TextureObject };

  modals: Record<ModalType, boolean>;
  setModal: (modal: ModalType, open: boolean) => void;
  cartItems: Omit<Furniture, "position" | "dimensions">[];
  addToCart: (id: string) => void;
  removeFromCart: (type: FurnitureType) => void;
  clearCart: () => void;

  furnitureMap: FurnitureMap;
  setFurnitureDimensions: (type: FurnitureType, dimensions: Triplet) => void;
  setFurniturePosition: (type: FurnitureType, position: Triplet) => void;

  customizePopUpKey: string;
  setCustomizePopUpKey: (key: string) => void;

  choiceMap: ChoiceMap;
  addChoice: (
    choice: {
      type: Choice["type"];
      value: any;
    },
    source?: string,
  ) => void;
};

export const allFloorsTextures: TextureObject[] = [
  {
    key: "base-color",
    name: "Base Color",
    maps: {
      normalMap: "images/wallpaper/bto-floorTile-Normal.webp",
      roughnessMap: "images/wallpaper/bto-floorTile-Roughness.webp",
      metallicMap: "images/wallpaper/bto-floorTile-Metallic.webp",
      aoMap: "images/wallpaper/bto-floorTile-AmbientOcclusion.webp",
      displacementMap: "images/wallpaper/bto-floorTile-Displacement.webp",
      map: "images/wallpaper/bto-floorTile-BaseColor.webp",
    },
  },
  {
    key: "white-stone",
    name: "White Stone",
    maps: {
      map: "images/wallpaper/floor-whitestone.jpg",
    },
    baseColor: "#c9c0b9",
  },
];

export const allWallTextures = [
  {
    key: "marble",
    name: "Marble",
    path: "images/wallpaper/marble-wall.webp",
  },
  {
    key: "stuco-plaster",
    name: "Stuco Plaster",
    path: "images/wallpaper/stuco-plaster-wall.jpg",
  },
];

export const allCeilingTextures = [
  {
    key: "ceiling",
    name: "Default",
    path: "images/wallpaper/bto-ceiling-texture.webp",
  },
];

export const allFurnitures: Omit<Furniture, "dimensions">[] = [
  // Counter Top
  {
    key: "counter-top-black-600mm",
    name: "Black Quartz Countertop 600mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/Quartzstone-countertop-lightcolour-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/black-quartz-600mm-countertop-diffused.webp",
      roughnessMap: "images/maps/black-quartz-600mm-countertop-roughness.webp",
    },
    price: 0,
  },
  {
    key: "counter-top-white-600mm",
    name: "White Quartz Countertop 600mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/Quartzstone-countertop-lightcolour-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/white-quartz-600mm-countertop-diffused.webp",
      roughnessMap: "images/maps/white-quartz-600mm-countertop-roughness.webp",
    },
    price: 0,
  },
  {
    key: "counter-top-black-800mm",
    name: "Black Quartz Countertop 800mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/Quartzstone-countertop-lightcolour-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/black-quartz-800mm-countertop-diffused.webp",
      roughnessMap: "images/maps/black-quartz-800mm-countertop-roughness.webp",
    },
    price: 0,
  },
  {
    key: "counter-top-white-800mm",
    name: "White Quartz Countertop 800mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/Quartzstone-countertop-lightcolour-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/white-quartz-800mm-countertop-diffused.webp",
      roughnessMap: "images/maps/white-quartz-800mm-countertop-roughness.webp",
    },
    price: 0,
  },

  // Vanity Cabinet
  {
    key: "vanity-cabinet-birch-600mm",
    name: "Birch Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Birch.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-blanco-600mm",
    name: "Blanco Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Blanco.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-brown-stone-600mm",
    name: "Brown Stone Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Brown-Stone.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-charcoal-ash-600mm",
    name: "Charcoal Ash Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Charcoal-Ash.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-matt-black-600mm",
    name: "Matt Black Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Matt-Black.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-graphite-600mm",
    name: "Graphite Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Graphite.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-oakwood-600mm",
    name: "Oakwood Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Oakwood.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-birch-800mm",
    name: "Birch Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Birch.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-blanco-800mm",
    name: "Blanco Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Blanco.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-brown-stone-800mm",
    name: "Brown Stone Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Brown-Stone.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-charcoal-ash-800mm",
    name: "Charcoal Ash Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Charcoal-Ash.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-graphite-800mm",
    name: "Graphite Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Graphite.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-matt-black-800mm",
    name: "Matt Black Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Matt-Black.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },
  {
    key: "vanity-cabinet-oakwood-800mm",
    name: "Oakwood Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Oakwood.png",
    },
    price: 0,
    variant: {
      isHybrid: false,
    },
  },

  // hybrid vanity cabinet
  {
    key: "vanity-cabinet-hybrid-pebble-500mm",
    name: "Hybrid Pebble Vanity Cabinet 500mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pebble-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pine-500mm",
    name: "Hybrid Pine Vanity Cabinet 500mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pine-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-walnut-500mm",
    name: "Hybrid Walnut Vanity Cabinet 500mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Walnut-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pebble-600mm",
    name: "Hybrid Pebble Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pebble-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pine-600mm",
    name: "Hybrid Pine Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pine-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-walnut-600mm",
    name: "Hybrid Walnut Vanity Cabinet 600mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Walnut-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },

  {
    key: "vanity-cabinet-hybrid-pebble-800mm",
    name: "Hybrid Pebble Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pebble-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-pine-800mm",
    name: "Hybrid Pine Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Pine-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },
  {
    key: "vanity-cabinet-hybrid-walnut-800mm",
    name: "Hybrid Walnut Vanity Cabinet 800mm",
    type: FurnitureType.VanityCabinet,
    path: "models/vanity-cabinet/Vanity-Cabinet-Hybrid-Walnut-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
    },
    textureMap: {},
    minPackageTier: "enhanced",
    price: 0,
    position: [0, 0, 0],
  },

  // insert basin
  {
    key: "insert-basin-ceramic-600mm",
    name: "Ceramic Insert Basin 600mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Ceramic-600mm.glb",
    size: 600,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-glass-black-600mm",
    name: "Glass Black Insert Basin 600mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-Black-600mm.glb",
    size: 600,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-glass-white-600mm",
    name: "Glass White Insert Basin 600mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-White-600mm.glb",
    size: 600,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-ceramic-800mm",
    name: "Ceramic Insert Basin 800mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Ceramic-800mm.glb",
    size: 800,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-glass-black-800mm",
    name: "Glass Black Insert Basin 800mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-Black-800mm.glb",
    size: 800,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-glass-white-800mm",
    name: "Glass White Insert Basin 800mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-White-800mm.glb",
    size: 800,
    variant: {
      isHybrid: false,
      insertBasinThickness: "thick",
    },
    minPackageTier: "enhanced",
    price: 0,
  },

  // hybrid insert basin
  {
    key: "insert-basin-hybrid-ceramic-500mm",
    name: "Ceramic Hybrid Insert Basin 500mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Ceramic-Hybrid-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thick",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-glass-black-500mm",
    name: "Black Glass Insert Basin 500mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-Black-Hybrid-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-glass-white-500mm",
    name: "White Glass Insert Basin 500mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-White-Hybrid-500mm.glb",
    size: 500,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-ceramic-600mm",
    name: "Ceramic Insert Basin 600mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Ceramic-Hybrid-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thick",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-glass-black-600mm",
    name: "Black Glass Insert Basin 600mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-Black-Hybrid-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-glass-white-600mm",
    name: "White Glass Insert Basin 600mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-White-Hybrid-600mm.glb",
    size: 600,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-ceramic-800mm",
    name: "Ceramic Insert Basin 800mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Ceramic-Hybrid-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thick",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-glass-black-800mm",
    name: "Black Glass Insert Basin 800mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-Black-Hybrid-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
  {
    key: "insert-basin-hybrid-glass-white-800mm",
    name: "White Glass Insert Basin 800mm",
    type: FurnitureType.InsertBasin,
    path: "models/insert-basin/Insert-Basin-Glass-White-Hybrid-800mm.glb",
    size: 800,
    variant: {
      isHybrid: true,
      insertBasinThickness: "thin",
    },
    minPackageTier: "enhanced",
    price: 0,
  },
];

const defaultFurnitureMap: Partial<Record<FurnitureType, Furniture>> = {
  [FurnitureType.VanityCabinet]: {
    position: [0, 0, 0],
    dimensions: [0, 0, 0],
    ...allFurnitures.find((f) => f.type === FurnitureType.VanityCabinet)!,
  },
};

const roomDimensions = {
  depth: 1.7,
  height: 2.0,
  length: 1.8,
};

const useStore = create(
  devtools<StoreState>((set) => ({
    roomDimensions,
    package: "default",
    setPackage: (p: string) => set({ package: p as PackageType }),
    textures: {
      floor: allFloorsTextures[0],
      wall: allWallTextures[0],
      ceiling: allCeilingTextures[0],
    },
    modals: {
      shoppingCart: false,
      customize: false,
    },
    cartItems: [],
    addToCart: (id: string) => {
      const furniture = allFurnitures.find((furniture) => furniture.key === id);
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
    furnitureMap: defaultFurnitureMap,

    setFurnitureDimensions: (type, dimensions) => {
      set(
        (state) => {
          return {
            ...state,
            furnitureMap: {
              ...state.furnitureMap,
              [type]: {
                ...state.furnitureMap[type],
                dimensions,
              },
            },
          };
        },
        undefined,
        "setFurnitureDimensions",
      );
    },
    setFurniturePosition: (type, position) => {
      set((state) => {
        return {
          ...state,
          furnitureMap: {
            ...state.furnitureMap,
            [type]: {
              ...state.furnitureMap[type],
              position,
            },
          },
        };
      });
    },

    customizePopUpKey: "",
    setCustomizePopUpKey: (key: string) => set({ customizePopUpKey: key }),

    choiceMap: {} as ChoiceMap,
    addChoice: (choice, source: string = "") => {
      eventSystem.dispatch(choice.type, choice.value);
      const furnitureType = choiceTypeToFurnitureTypeMap[choice.type];
      if (furnitureType) {
        const furniture = allFurnitures.find(
          (furniture) => furniture.key === choice.value,
        );
        if (choice.value === null) {
          set(
            (state) => {
              const newFurnitureMap = {
                ...state.furnitureMap,
              };
              delete newFurnitureMap[furnitureType];
              return {
                furnitureMap: newFurnitureMap,
              };
            },
            undefined,
            `addChoice/furniture/${source}`,
          );
        } else {
          set(
            (state) => {
              return {
                furnitureMap: {
                  ...state.furnitureMap,
                  [furnitureType]: {
                    ...{
                      dimensions: [0, 0, 0] as Triplet,
                    },
                    ...state.furnitureMap[furnitureType],
                    ...furniture,
                  },
                },
              };
            },
            undefined,
            `addChoice/furniture/${source}`,
          );
        }
      }

      if (choice.value === null) {
        set(
          (state) => {
            const newChoiceMap = {
              ...state.choiceMap,
            };
            delete newChoiceMap[choice.type];
            return {
              choiceMap: newChoiceMap,
            };
          },
          undefined,
          `addChoice/choiceMap/${source}`,
        );
        return;
      } else {
        set(
          (state) => {
            return {
              choiceMap: {
                ...state.choiceMap,
                [choice.type]: choice,
              },
            };
          },
          undefined,
          `addChoice/choiceMap/${source}`,
        );
      }
    },
  })),
);
export type EventCallback = (event: ChoiceType, value: any) => void;

class EventSystem {
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

export default useStore;
