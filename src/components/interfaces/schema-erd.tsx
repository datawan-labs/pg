import mermaid from "mermaid";
import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PublicSchemaTree } from "./schema-tree";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import { ComponentProps, forwardRef, useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  IconMinus,
  IconPlus,
  IconReload,
  IconDownload,
  IconZoomReset,
  IconFocusCentered,
} from "@tabler/icons-react";
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

const Mermaid = () => {
  const [erdElement, setERDElement] = useState<string>("");

  const db = useDBStore((s) => s.active!.name);

  const erd = useDBStore((s) => s.databases[s.active!.name].erd);

  /**
   * if you find this bug, may be whondering what's going on with
   * this code. the bug is when you open ERD menu for second time,
   * you get nothing diagram rendered, idk who caused this but when
   * I check svg result from render method, it's corrupt. why it's
   * corrupt?, turns out, when we in development mode (react), this
   * useEffect run twice (don't ask me why, it's feature they said :D).
   * because of this, for the second time useEffect called, this
   * render method return empty svg string.
   */
  useEffect(() => {
    mermaid.initialize({ theme: "neutral",  });
    mermaid.render("erd-diagram", erd).then(({ svg }) => setERDElement(svg));
  }, []);

  /**
   * export diagram to svg
   */
  const exportERD = () => {
    mermaid.render("erd-diagram-export", erd).then(({ svg }) => {
      const url = URL.createObjectURL(
        new Blob([svg], { type: "image/svg+xml" })
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = `${db}.svg`;

      link.click();

      URL.revokeObjectURL(url);
    });
  };

  return (
    <TransformWrapper
      centerOnInit
      maxScale={50}
      initialScale={1}
      wheel={{ step: 2, smoothStep: 0.01 }}
    >
      {({ zoomIn, zoomOut, resetTransform, centerView }) => (
        <>
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: erdElement }} />
          </TransformComponent>
          <div className="-translate-x-1/2 pointer-events-auto absolute bottom-4 left-1/2 flex gap-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => zoomIn()}
                >
                  <IconPlus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>zoom in</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => zoomOut()}
                >
                  <IconMinus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>zoom out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => resetTransform()}
                >
                  <IconZoomReset className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>reset</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => centerView()}
                >
                  <IconFocusCentered className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>center</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => exportERD()}
                >
                  <IconDownload className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>center</TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
    </TransformWrapper>
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
            <div className="relative size-full overflow-hidden bg-muted">
              <Mermaid />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }
);
