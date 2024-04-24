import { Logo } from "../ui/logo";
import { cn } from "@/utils/classnames";
import { ComponentProps, FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Header: FC<ComponentProps<"div">> = ({ className, ...props }) => (
  <header
    className={cn(
      "sticky top-0 z-10 flex h-12 items-center border-b bg-background",
      className
    )}
    {...props}
  />
);

export const HeaderLogo = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="hidden size-12 items-center justify-center border-r md:flex">
        <Logo className="size-8" />
      </div>
    </TooltipTrigger>
    <TooltipContent side="right" sideOffset={5}>
      Datawan
    </TooltipContent>
  </Tooltip>
);

export const HeaderTitle: FC<ComponentProps<"h1">> = ({
  className,
  children,
  ...props
}) => (
  <h1 className={cn("px-2 font-semibold text-xl", className)} {...props}>
    {children}
  </h1>
);
