import { cn } from "@/utils/classnames";
import { ComponentProps, forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
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
        "flex w-12 flex-col items-center justify-center gap-1 border-r py-2",
        className
      )}
      {...props}
    />
  )
);

export const NavigationItem = forwardRef<
  HTMLButtonElement,
  ButtonProps & { tooltip: string; active?: boolean }
>(({ tooltip, className, active, ...props }, ref) => (
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
    <TooltipContent side="right" sideOffset={5}>
      {tooltip}
    </TooltipContent>
  </Tooltip>
));
