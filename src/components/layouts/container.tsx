import { ComponentProps, FC } from "react";
import { Modals } from "@/components/ui/modals";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Container: FC<ComponentProps<"div">> = ({ children }) => (
  <div className="flex h-svh w-full flex-col overflow-hidden bg-background">
    <TooltipProvider>
      {children}
      <Toaster />
      <Modals />
    </TooltipProvider>
  </div>
);
