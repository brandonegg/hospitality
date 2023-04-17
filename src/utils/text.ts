import type { Address } from "@prisma/client";

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
