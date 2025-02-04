export const WALL_THICKNESS = 0.075;

export const packageChoices = [
  { value: "default", label: "BTO default" },
  { value: "enhanced", label: "Enhanced" },
  {
    value: "premium",
    label: "Premium (Coming Soon)",
    disabled: true,
  },
  { value: "luxury", label: "Luxury (Coming Soon)", disabled: true },
];

export const startingPrices = {
  default: 0,
  enhanced: 2900,
  premium: 4900,
  luxury: 7900,
};
