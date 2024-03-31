import { cn } from "@/utils/classnames";
import { IconSquare } from "@tabler/icons-react";
import { ComponentProps, FC } from "react";

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
  <div className="hidden size-12 items-center justify-center border-r md:flex">
    <IconSquare className="size-5 fill-foreground" />
  </div>
);

export const HeaderTitle: FC<ComponentProps<"h1">> = ({
  className,
  children,
  ...props
}) => (
  <h1 className={cn("px-4 text-xl font-semibold", className)} {...props}>
    {children}
  </h1>
);
