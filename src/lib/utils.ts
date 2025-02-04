export const packageTiers = ["default", "enhanced", "premium", "luxury"];

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
