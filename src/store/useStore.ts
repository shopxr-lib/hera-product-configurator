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
  Stand = 9,
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
  minPackageTier?: PackageType;
  textureMap?: Partial<TextureMap>;
  materials?: Partial<MaterialMap>;
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

export type MaterialMap = {
  color: number;
  metalness: number;
  roughness: number;
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
      value: string;
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
      preserveSelection?: boolean;
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
    key: "counter-top-birch-600mm",
    name: "Birch Countertop 600mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Birch.png",
    },
    price: 0,
  },
  {
    key: "counter-top-brownstone-600mm",
    name: "Brown Stone Countertop 600mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Brown-Stone.png",
    },
    price: 0,
  },
  {
    key: "counter-top-charcoal-ash-600mm",
    name: "Brown Stone Countertop 600mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Charcoal-Ash.png",
    },
    price: 0,
  },
  {
    key: "counter-top-oakwood-600mm",
    name: "Brown Stone Countertop 600mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-600mm.glb",
    size: 600,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Oakwood.png",
    },
    price: 0,
  },
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
    key: "counter-top-birch-800mm",
    name: "Birch Countertop 800mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Birch.png",
    },
    price: 0,
  },
  {
    key: "counter-top-brownstone-800mm",
    name: "Brown Stone Countertop 800mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Brown-Stone.png",
    },
    price: 0,
  },
  {
    key: "counter-top-charcoal-ash-800mm",
    name: "Brown Stone Countertop 800mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Charcoal-Ash.png",
    },
    price: 0,
  },
  {
    key: "counter-top-oakwood-800mm",
    name: "Brown Stone Countertop 800mm",
    type: FurnitureType.BasinCounterTop,
    path: "models/counter-top/countertop-800mm.glb",
    size: 800,
    minPackageTier: "enhanced",
    textureMap: {
      map: "images/maps/vanity-cabinet/Oakwood.png",
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
    path: "models/insert-basin/Insert-Basin-Ceramic-Hybrid-50cm.glb",
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
    path: "models/insert-basin/Insert-Basin-Ceramic-Hybrid-60cm.glb",
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
    path: "models/insert-basin/Insert-Basin-Ceramic-Hybrid-80cm.glb",
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

  // basin
  {
    key: "basin-rectangular-ceramic-blush",
    name: "Rectangular Ceramic Basin - Blush",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Blush.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-eclair",
    name: "Rectangular Ceramic Basin - Eclair",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Eclair.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-matt-black",
    name: "Rectangular Matt Black Basin",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Matt-Black.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-matt-white",
    name: "Rectangular Matte White Basin",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Matt-White.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-mocha",
    name: "Rectangular Ceramic Basin - Mocha",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Mocha.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-moss",
    name: "Rectangular Ceramic Basin - Moss",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Moss.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-slate-grey",
    name: "Rectangular Ceramic Basin - Slate Grey",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Slate-Grey.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-storm",
    name: "Rectangular Ceramic Basin - Storm",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Storm.png",
    },
    price: 0,
  },
  {
    key: "basin-rectangular-ceramic-teal",
    name: "Rectangular Ceramic Basin - Teal",
    type: FurnitureType.Basin,
    path: "models/basin/rectangle-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Teal.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-blush",
    name: "Round Ceramic Basin - Blush",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Blush.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-matt-black",
    name: "Round Ceramic Basin - Matt Black",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Matt-Black.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-matt-white",
    name: "Round Ceramic Basin - Matt White",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Matt-White.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-mint",
    name: "Round Ceramic Basin - Mint",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Mint.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-mocha",
    name: "Round Ceramic Basin - Mocha",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Mocha.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-slate-grey",
    name: "Round Ceramic Basin - Slate Grey",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Slate-Grey.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-stone-grey",
    name: "Round Ceramic Basin - Stone Grey",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Stone-Grey.png",
    },
    price: 0,
  },
  {
    key: "basin-round-ceramic-tangerine",
    name: "Round Ceramic Basin - Tangerine",
    type: FurnitureType.Basin,
    path: "models/basin/round-ceramic-basin.glb",
    textureMap: {
      map: "images/maps/basin/Basin-Tangerine.png",
    },
    price: 0,
  },

  // overflow-ring
  {
    key: "basin-overflow-ring-chrome",
    name: "Chrome Overflow Ring",
    type: FurnitureType.OverflowRing,
    path: "models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "basin-overflow-ring-gold",
    name: "Gold Overflow Ring",
    type: FurnitureType.OverflowRing,
    path: "models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "basin-overflow-ring-gun-metal",
    name: "Gun Metal Overflow Ring",
    type: FurnitureType.OverflowRing,
    path: "models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "basin-overflow-ring-matt-black",
    name: "Matt Black Overflow Ring",
    type: FurnitureType.OverflowRing,
    path: "models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "basin-overflow-ring-rose-gold",
    name: "Rose Gold Overflow Ring",
    type: FurnitureType.OverflowRing,
    path: "models/overflow-ring/overflow-ring.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },

  // popup
  {
    key: "popup-chrome",
    name: "Chrome Popup",
    type: FurnitureType.Popup,
    path: "models/popup/popup.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "popup-gold",
    name: "Gold Popup",
    type: FurnitureType.Popup,
    path: "models/popup/popup.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "popup-gun-metal",
    name: "Gun Metal Popup",
    type: FurnitureType.Popup,
    path: "models/popup/popup.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "popup-matt-black",
    name: "Matt Black Popup",
    type: FurnitureType.Popup,
    path: "models/popup/popup.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "popup-rose-gold",
    name: "Rose Gold Popup",
    type: FurnitureType.Popup,
    path: "models/popup/popup.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },

  // tap
  {
    key: "tap-chrome-8101",
    name: "Chrome 8101",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8101.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-chrome-8102",
    name: "Chrome 8102",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8102.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-chrome-8201",
    name: "Chrome 8201",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8201.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-chrome-8202",
    name: "Chrome 8202",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8202.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-chrome-8301",
    name: "Chrome 8301",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8301.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-chrome-8302",
    name: "Chrome 8302",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8302.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-gun-metal-8101",
    name: "Gun Metal 8101",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8101.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-gun-metal-8102",
    name: "Gun Metal 8102",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8102.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-gun-metal-8201",
    name: "Gun Metal 8201",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8201.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-gun-metal-8202",
    name: "Gun Metal 8202",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8202.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-gun-metal-8301",
    name: "Gun Metal 8301",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8301.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-gun-metal-8302",
    name: "Gun Metal 8302",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8302.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-black-8101",
    name: "Matt Black 8101",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8101.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-black-8102",
    name: "Matt Black 8102",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8102.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-black-8201",
    name: "Matt Black 8201",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8201.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-black-8202",
    name: "Matt Black 8202",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8202.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-black-8301",
    name: "Matt Black 8301",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8301.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-black-8302",
    name: "Matt Black 8302",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8302.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-gold-8101",
    name: "Matt Gold 8101",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8101.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-gold-8102",
    name: "Matt Gold 8102",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8102.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-gold-8201",
    name: "Matt Gold 8201",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8201.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-gold-8202",
    name: "Matt Gold 8202",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8202.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-gold-8301",
    name: "Matt Gold 8301",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8301.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-matt-gold-8302",
    name: "Matt Gold 8302",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8302.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-rose-gold-8101",
    name: "Rose Gold 8101",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8101.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-rose-gold-8102",
    name: "Rose Gold 8102",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8102.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-rose-gold-8201",
    name: "Rose Gold 8201",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8201.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-rose-gold-8202",
    name: "Rose Gold 8202",
    type: FurnitureType.BasinTap,
    path: "models/tap/tap-8202.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-rose-gold-8301",
    name: "Rose Gold 8301",
    path: "models/tap/tap-8301.glb",
    type: FurnitureType.BasinTap,
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "tap-rose-gold-8302",
    name: "Rose Gold 8302",
    path: "models/tap/tap-8302.glb",
    type: FurnitureType.BasinTap,
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },

  // handle
  {
    key: "handle-chrome-50cm",
    name: "Chrome Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-gold-50cm",
    name: "Gold Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-gun-metal-50cm",
    name: "Gun Metal Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-matt-black-50cm",
    name: "Matt Black Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-rose-gold-50cm",
    name: "Rose Gold Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-500mm.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-chrome-60cm",
    name: "Chrome Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-gold-60cm",
    name: "Gold Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-gun-metal-60cm",
    name: "Gun Metal Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-matt-black-60cm",
    name: "Matt Black Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-rose-gold-60cm",
    name: "Rose Gold Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-600mm.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-chrome-80cm",
    name: "Chrome Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0xc8c8c8,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-gold-80cm",
    name: "Gold Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0xb48f5b,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-gun-metal-80cm",
    name: "Gun Metal Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0x5a5a5a,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-matt-black-80cm",
    name: "Matt Black Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0x313131,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },
  {
    key: "handle-rose-gold-80cm",
    name: "Rose Gold Handle",
    type: FurnitureType.Handle,
    path: "models/handle/Vanity-Cabinet-Handle-800mm.glb",
    materials: {
      color: 0xb47765,
      metalness: 1,
      roughness: 0.087,
    },
    price: 0,
  },

  // stand
  {
    key: "stand-60cm",
    name: "60cm Stand",
    type: FurnitureType.Stand,
    path: "models/stand/Vanity-Cabinet-Stand-600mm.glb",
    price: 0,
  },
  {
    key: "stand-80cm",
    name: "80cm Stand",
    type: FurnitureType.Stand,
    path: "models/stand/Vanity-Cabinet-Stand-800mm.glb",
    price: 0,
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

const roomDimensions = {
  depth: 1.7,
  height: 2.0,
  length: 1.8,
};

function isFurnitureType(key: any): key is keyof typeof defaultFurnitures {
  return Object.keys(defaultFurnitures).includes(key);
}

const useStore = create(
  devtools<StoreState>((set, get) => ({
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
    furnitureMap: Object.keys(defaultFurnitures).reduce<
      StoreState["furnitureMap"]
    >((acc, type) => {
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
    }, {}),

    setFurnitureDimensions: (type, dimensions) => {
      set(
        (state) => {
          return {
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
        { type: "setFurnitureDimensions", payload: { type, dimensions } },
      );
    },
    setFurniturePosition: (type, position) => {
      set(
        (state) => {
          return {
            furnitureMap: {
              ...state.furnitureMap,
              [type]: {
                ...state.furnitureMap[type],
                position,
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

    choiceMap: {
      breadth: { type: "breadth", value: 46 },
      width: { type: "width", value: 60 },
      "vanity-color": {
        type: "vanity-color",
        value: defaultFurnitures[FurnitureType.VanityCabinet],
      },
      top: {
        type: "top",
        value: "insert-basin",
      },
      "insert-basin": {
        type: "insert-basin",
        value: defaultFurnitures[FurnitureType.InsertBasin],
      },
      "overflow-ring": {
        type: "overflow-ring",
        value: defaultFurnitures[FurnitureType.OverflowRing],
      },
      popup: {
        type: "popup",
        value: defaultFurnitures[FurnitureType.Popup],
      },
      tap: {
        type: "tap",
        value: defaultFurnitures[FurnitureType.BasinTap],
      },
      handle: {
        type: "handle",
        value: defaultFurnitures[FurnitureType.Handle],
      },
      stand: {
        type: "stand",
        value: defaultFurnitures[FurnitureType.Stand],
      },
    } as ChoiceMap,
    addChoice: (choice, source: string = "") => {
      eventSystem.dispatch(choice.type, choice.value);

      const furnitureType = choiceTypeToFurnitureTypeMap[choice.type];
      const currentState = get();
      const newFurnitureMap = { ...currentState.furnitureMap };
      const newChoiceMap = { ...currentState.choiceMap };

      if (furnitureType) {
        const furniture = allFurnitures.find(
          (furniture) => furniture.key === choice.value,
        );
        if (choice.value === null) {
          delete newFurnitureMap[furnitureType];
        } else if (furniture) {
          newFurnitureMap[furnitureType] = {
            ...{ dimensions: [0, 0, 0] as Triplet },
            ...currentState.furnitureMap[furnitureType],
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
        };
      }

      set(
        {
          furnitureMap: newFurnitureMap,
          choiceMap: newChoiceMap,
        },
        undefined,
        { type: "addChoice", payload: { choice, source } },
      );
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
