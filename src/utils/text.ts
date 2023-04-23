import type { Address } from "@prisma/client";

export const PRICE_REGEX = /(\d+\.\d{1,2})/;

/**
 * Join multiple class names into one string
 * @param classes array of class names
 * @returns string of class names
 */
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Convert an address to a formatted string.
 * {street} {city}, {state} {zip}
 * @param address Address prisma db object
 */
export function addressToString(address?: Address | null) {
  if (!address) {
    return "";
  }
  return `${address.street} ${address.city}, ${address.state} ${address.zipCode}`;
}

/**
 * Parses a price string of format *+.*+ and returns the formatted string to two decimal places with currency symbol removed.
 */
export function parsePriceString(
  amount: string,
  toFixed = 2
): string | undefined {
  const match = amount.match(PRICE_REGEX);

  if (!match || match.length == 0 || match.length > 1) {
    return;
  }

  return parseFloat(match[0]).toFixed(toFixed);
}
