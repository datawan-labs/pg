import { cn } from "@/utils/classnames";
import { ComponentProps, forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Navigation = forwardRef<HTMLDivElement, ComponentProps<"nav">>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "flex w-full md:w-12 flex-row md:flex-col items-center justify-evenly md:justify-start gap-1 border-t md:border-t-0 md:border-r py-0.5 md:py-2",
        className
      )}
      {...props}
    />
  )
);

export const NavigationItem = forwardRef<
  HTMLButtonElement,
  ButtonProps & { tooltip: string; active?: boolean }
>(({ tooltip, className, active, ...props }, ref) => {
  const isDesktop = useIsDesktop();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          size="icon"
          variant="ghost"
          aria-label={tooltip}
          className={cn(
            "rounded-lg",
            active && "bg-muted border border-border",
            className
          )}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent side={isDesktop ? "right" : "top"} sideOffset={5}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
});
