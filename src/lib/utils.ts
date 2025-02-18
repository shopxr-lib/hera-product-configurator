export const packageTiers = ["default", "enhanced", "premium", "luxury"];
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to handle errors in a Go-like style.
 * @param promise - The promise to handle.
 * @returns A tuple containing the result and the error.
 */
export async function to<T, E = Error>(
  promise: Promise<T>,
): Promise<[T | null, E | null]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error as E];
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
