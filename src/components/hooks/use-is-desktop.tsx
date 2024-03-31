import { useMediaQuery } from "./use-media-query";

export const DESKTOP_BREAKPOINT = "(min-width: 768px)";

export const useIsDesktop = () => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  return isDesktop;
};
