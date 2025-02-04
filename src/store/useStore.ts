import { create } from "zustand";

export enum FurnitureType {
  Basin = 1,
  BasinTap = 2,
  BasinCounterTop = 3,
  ToiletBowl = 4,
  Ceiling = 5,
  Shower = 6,
  VanityCabinet = 7,
  InsertBasin = 8,
}

type Triplet = [number, number, number];

export type Furniture = {
  key: string;
  type: FurnitureType;
  name: string;
  path: string;
  size: number;
  dimensions: Triplet;
  position: Triplet;
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
  setDefaultFurnitureMap: () => void;
  setFurnitureDimensions: (type: FurnitureType, dimensions: Triplet) => void;
  setFurniturePosition: (type: FurnitureType, position: Triplet) => void;

  customizePopUpKey: string;
  customizeSelected: string[];
  customizeSelectedLevelKeys: string[];
  clearCustomizeSelectedLevelKeys: () => void;
  addCustomizeSelectedLevelKeys: (key: string, level: number) => void;
  setCustomizePopUpKey: (key: string) => void;
  clearCustomizeSelected: () => void;
  addCustomizeSelected: (key: string, level: number) => void;
  commitCustomizeSelected: () => void;
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

export const allFurnitures: Omit<Furniture, "dimensions" | "position">[] = [
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
  },

  // insert basin
  {
    key: "insert-basin-ceramic-500mm",
    name: "Ceramic Insert Basin 500mm",
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
    key: "insert-basin-glass-black-500mm",
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
    key: "insert-basin-glass-white-500mm",
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
    key: "insert-basin-ceramic-600mm",
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
    key: "insert-basin-glass-black-600mm",
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
    key: "insert-basin-glass-white-600mm",
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
    key: "insert-basin-ceramic-800mm",
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
    key: "insert-basin-glass-black-800mm",
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
    key: "insert-basin-glass-white-800mm",
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

const defaultBasin: Furniture = {
  key: "basin",
  name: "Basin",
  type: FurnitureType.Basin,
  path: "models/bto-basin-530mm.glb",
  size: 530,
  dimensions: [0, 0, 0],
  position: [0, 0, 0],
  minPackageTier: "default",
  price: 0,
};

const defaultFurnitureMap: Partial<Record<FurnitureType, Furniture>> = {
  [FurnitureType.Basin]: defaultBasin,
  [FurnitureType.BasinTap]: {
    key: "basin-tap",
    name: "Basin Tap",
    type: FurnitureType.BasinTap,
    path: "models/bto-default-tap.glb",
    size: 0,
    dimensions: [0, 0, 0],
    position: [0, 0, 0],
    minPackageTier: "default",
    price: 0,
  },
  [FurnitureType.ToiletBowl]: {
    key: "toilet-bowl",
    name: "Toilet Bowl",
    type: FurnitureType.ToiletBowl,
    path: "models/HDB-BTO-toiletbowl.glb",
    size: 0,
    dimensions: [0, 0, 0],
    position: [0, 0, 0],
    minPackageTier: "default",
    price: 0,
  },
  [FurnitureType.Ceiling]: {
    key: "toilet-ceiling",
    name: "Toilet Ceiling",
    type: FurnitureType.Ceiling,
    path: "models/bto-toilet-ceiling-top-section.glb",
    size: 0,
    dimensions: [0, 0, 0],
    position: [0, 0, 0],
    minPackageTier: "default",
    price: 0,
  },
  [FurnitureType.Shower]: {
    key: "shower",
    name: "Shower",
    type: FurnitureType.Shower,
    path: "models/bto-default-showerhead.glb",
    size: 0,
    dimensions: [0, 0, 0],
    position: [0, 0, 0],
    minPackageTier: "default",
    price: 0,
  },
};

const roomDimensions = {
  depth: 1.7,
  height: 2.0,
  length: 1.8,
};

const useStore = create<StoreState>((set, get) => ({
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
  setDefaultFurnitureMap: () => {
    set((state) => {
      return {
        ...state,
        furnitureMap: defaultFurnitureMap,
      };
    });
  },

  setFurnitureDimensions: (type, dimensions) => {
    set((state) => {
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
    });
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
  customizeSelected: [],
  customizeSelectedLevelKeys: [],
  addCustomizeSelectedLevelKeys: (key, level) => {
    const current = get().customizeSelectedLevelKeys;

    if (level < 0) {
      return;
    }

    const cappedLevel = Math.min(level, current.length);

    if (cappedLevel === current.length) {
      set({ customizeSelectedLevelKeys: [...current, key] });
      return;
    }

    const newSelected = [...current];
    newSelected[cappedLevel] = key;
    set({ customizeSelectedLevelKeys: newSelected });
  },
  clearCustomizeSelectedLevelKeys() {
    set({ customizeSelectedLevelKeys: [] });
  },
  setCustomizePopUpKey: (key) => set({ customizePopUpKey: key }),
  clearCustomizeSelected: () => set({ customizeSelected: [] }),
  addCustomizeSelected: (key, level) => {
    const current = get().customizeSelected;
    if (level < 0) {
      return;
    }

    const cappedLevel = Math.min(level, current.length);

    if (cappedLevel === current.length) {
      set({ customizeSelected: [...current, key] });
      return;
    }

    const newSelected = [...current];
    newSelected[cappedLevel] = key;
    set({ customizeSelected: newSelected });
  },
  commitCustomizeSelected: () => {
    const selected = get().customizeSelected;
    if (selected.length <= 0) {
      return;
    }

    const popupKey = get().customizePopUpKey;

    switch (popupKey) {
      case "wallpaper": {
        switch (selected[0]) {
          case "wall": {
            if (selected.length <= 1) {
              return;
            }
            const texture = allWallTextures.find(
              (texture) => texture.key === selected[1],
            );
            if (!texture) {
              return;
            }

            set({
              textures: {
                ...get().textures,
                wall: texture,
              },
            });
            break;
          }
          case "ceiling": {
            if (selected.length <= 1) {
              return;
            }
            const texture = allCeilingTextures.find(
              (texture) => texture.key === selected[1],
            );
            if (!texture) {
              return;
            }

            set({
              textures: {
                ...get().textures,
                ceiling: texture,
              },
            });

            break;
          }

          case "floor": {
            if (selected.length <= 1) {
              return;
            }
            const texture = allFloorsTextures.find(
              (texture) => texture.key === selected[1],
            );
            if (!texture) {
              return;
            }

            set({
              textures: {
                ...get().textures,
                floor: texture,
              },
            });
          }
        }
        break;
      }

      case "vanitycabinet": {
        const size = selected[0];
        const cabinetVariant = selected[1];
        const finalLevelComponent = selected[2]; // countertop or insert-basin

        const finalComponentKey = `${finalLevelComponent}-${size}mm`;
        const vanityCabinetKey = `vanity-cabinet-${cabinetVariant}-${size}mm`;

        const vanityCabinet = allFurnitures.find(
          (furniture) => furniture.key === vanityCabinetKey,
        );
        const { addToCart, removeFromCart } = get();
        if (vanityCabinet) {
          const oldFurnitureMap = get().furnitureMap;
          const newFurnitureMap = {
            ...oldFurnitureMap,
            [FurnitureType.VanityCabinet]: {
              ...{
                position: [0, 0, 0] as Triplet,
                dimensions: [0, 0, 0] as Triplet,
              },
              ...oldFurnitureMap[FurnitureType.VanityCabinet],
              ...vanityCabinet,
            },
          };

          // Remove default basin and counter top if hybrid
          if (vanityCabinet.variant?.isHybrid) {
            delete newFurnitureMap[FurnitureType.Basin];
            delete newFurnitureMap[FurnitureType.BasinCounterTop];
          } else if (!newFurnitureMap[FurnitureType.Basin]) {
            newFurnitureMap[FurnitureType.Basin] = defaultBasin;
            newFurnitureMap[FurnitureType.VanityCabinet].variant = {
              ...newFurnitureMap[FurnitureType.VanityCabinet].variant,
              isHybrid: false,
            };

            delete newFurnitureMap[FurnitureType.InsertBasin];
          }

          set({
            furnitureMap: newFurnitureMap,
          });
          removeFromCart(FurnitureType.VanityCabinet);
          addToCart(vanityCabinetKey);
        }

        const finalComponent = allFurnitures.find(
          (furniture) => furniture.key === finalComponentKey,
        );
        if (finalComponent) {
          const oldFurnitureMap = get().furnitureMap;

          const newFurnitureMap = {
            ...oldFurnitureMap,
            [finalComponent.type]: {
              ...{
                position: [0, 0, 0] as Triplet,
                dimensions: [0, 0, 0] as Triplet,
              },
              ...oldFurnitureMap[finalComponent.type],
              ...finalComponent,
            },
          };

          set({
            furnitureMap: newFurnitureMap,
          });
          removeFromCart(FurnitureType.BasinCounterTop);
          removeFromCart(FurnitureType.InsertBasin);
          addToCart(finalComponentKey);
        }

        break;
      }
    }
  },
}));

export default useStore;
