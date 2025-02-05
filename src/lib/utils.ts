export const packageTiers = ["default", "enhanced", "premium", "luxury"];
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const isPackageTierSufficient = (
  minPackageTier: string,
  selectedPackage: string,
) => {
  for (let i = 0; i < packageTiers.length; i++) {
    if (packageTiers[i] === minPackageTier) {
      return true;
    }
    if (packageTiers[i] === selectedPackage) {
      return false;
    }
  }

  return false;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
