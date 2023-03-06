/**
 * Join multiple class names into one string
 * @param classes array of class names
 * @returns string of class names
 */
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
