import mermaid from "mermaid";
import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PublicSchemaTree } from "./schema-tree";
import { IconReload } from "@tabler/icons-react";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import { ComponentProps, forwardRef, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

mermaid.initialize({ theme: "neutral" });

const Mermaid = () => {
  const [erdElement, setERDElement] = useState<string>("");

  const erd = useDBStore((s) => s.databases[s.active!.name].erd);

  useEffect(() => {
    if (erd)
      mermaid.render("erd-diagram", erd).then(({ svg }) => setERDElement(svg));
  }, [erd]);

  return (
    <div
      className="flex size-full items-center justify-center overflow-auto"
      dangerouslySetInnerHTML={{ __html: erdElement }}
    />
  );
};

export const SchemaERD = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const isDesktop = useIsDesktop();

    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex size-full flex-1 flex-col p-0", className)}
      >
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full flex-1"
          autoSaveId="playground-layout"
        >
          {isDesktop && (
            <>
              <ResizablePanel id="erd-schema" defaultSize={20} order={1}>
                <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
                  <div className="flex flex-row items-center justify-between border-b py-1">
                    <Label>Public Schema</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-6"
                          onClick={() => useDBStore.getState().reload()}
                        >
                          <IconReload className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reload Schema</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <PublicSchemaTree />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle direction="vertical" />
            </>
          )}
          <ResizablePanel order={2}>
            <div className="size-full overflow-auto bg-muted">
              <Mermaid />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }
);
