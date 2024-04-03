import { cn } from "@/utils/classnames";
import { ComponentProps, forwardRef } from "react";

export const Logo = forwardRef<SVGSVGElement, ComponentProps<"svg">>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      width="500"
      fill="none"
      height="500"
      viewBox="0 0 500 500"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        rx="250"
        width="500"
        height="500"
        fill="#1F2023"
        className="logo-background"
      />
      <path
        d="M130 290C130 267.909 147.909 250 170 250H205V400H170C147.909 400 130 382.091 130 360V290Z"
        fill="#F0B70B"
      />
      <path
        d="M212 340H287V360C287 382.091 269.091 400 247 400H212V340Z"
        fill="#F0B70B"
      />
      <path
        d="M212 230C212 207.909 229.909 190 252 190H287V250H212V230Z"
        fill="#F0B70B"
      />
      <path
        d="M294 140C294 117.909 311.909 100 334 100H369V360C369 382.091 351.091 400 329 400H294V140Z"
        fill="#F0B70B"
      />
    </svg>
  )
);
