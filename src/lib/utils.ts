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

/**
 * Truncates a string to a specified maximum length, adding "..." if the string exceeds that length.
 *
 * @param {string} input - The string to be truncated.
 * @param {number} [maxLength=50] - The maximum length of the truncated string including the ellipsis.
 * @returns {string} - The truncated string with "..." added if it exceeds the maximum length.
 */
export function truncateString(input: string, maxLength: number): string {
  if (input.length > maxLength) {
    return `${input.slice(0, maxLength - 3)} ...`;
  }
  return input;
}
