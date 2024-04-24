import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

/**
 * utilitu for generating class from multiple entries and
 * duplicating tailwind class
 *
 * @param inputs
 * @returns
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * SHADCN base theme classes
 */
const SHADCN_CLASSES = [
  "--background",
  "--foreground",
  "--muted",
  "--muted-foreground",
  "--popover",
  "--popover-foreground",
  "--card",
  "--card-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
] as const;

export type ColorVariable = (typeof SHADCN_CLASSES)[number];

/**
 * return all color scheme from css variables, hsl values
 */
export const getColorScheme = (): Record<ColorVariable, string> => {
  const style = getComputedStyle(document.body);

  return SHADCN_CLASSES.reduce(
    (colors, variable) => {
      colors[variable] = `hsl(${style.getPropertyValue(variable).trim()})`;

      return colors;
    },
    {} as Record<ColorVariable, string>
  );
};
