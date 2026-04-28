/**
 * Concatenate CSS class names, filtering out falsy values.
 * Useful for conditional className composition in JSX.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
