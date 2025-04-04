export const packageTiers = ["default", "enhanced", "premium", "luxury"];
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { notifications } from "@mantine/notifications";
import { NotificationType } from "../types";

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

/**
 * Capitalizes first letter of a string
 * @param {string} input string
 * @returns {string} string
 */
export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

/**
 * Show a success or error notification.
 * @param type "success" or "error"
 * @param title Notification title
 * @param message Notification message
 */
export const showNotification = (
  type: NotificationType,
  title: string,
  message?: string
) => {
  notifications.show({
    title,
    message,
    color: type === "success" ? "green" : "red",
    position: "top-right",
    styles: (theme) => ({
      root: {
        fontSize: theme.fontSizes.md,
        padding: theme.spacing.md,
        minWidth: 300,
      },
      title: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 600,
        paddingLeft: 10,
        marginBottom: 5
      },
      description: {
        paddingLeft: 10,
      },
    }),
  });
};

export function formatDate(
  timestamp?: number, 
  options?: Intl.DateTimeFormatOptions
): string {
  if (!timestamp) return "N/A";

  const date = new Date(timestamp * 1000);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", { ...defaultOptions, ...options });
}

/**
 * Humanizes a string
 * @param {string} input string
 * @returns {string} string
 */
export function humanize(text: string): string {
  if (!text) return text;
  return text
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (c) => c.toUpperCase());
};

export function generateSearchPhrase(keys?: string[]): string {
  if (!keys || keys.length === 0) return 'field';
  if (keys.length === 1) return keys[0];
  if (keys.length === 2) return `${keys[0]} or ${keys[1]}`;
  const allButLast = keys.slice(0, -1).join(', ');
  const last = keys[keys.length - 1];
  return `${allButLast}, or ${last}`;
};