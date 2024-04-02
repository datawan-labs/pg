import { useDBStore } from "@/stores";
import { DataViewer } from "./viewer";
import { cn } from "@/utils/classnames";
import { DatabaseSchema } from "./schema";
import { postgresTransformer } from "./utils";
import { toast } from "@/components/ui/sonner";
import { modal } from "@/components/ui/modals";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { useState, forwardRef, ComponentProps } from "react";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import { Cell, DataGridValue } from "@/components/ui/data-viewer";
import { IconPlayerPlay, IconTableColumn } from "@tabler/icons-react";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const QueryPlayground = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const isDesktop = useIsDesktop();

  const [query, setQuery] = useState<string>();

  const [result, setResult] = useState<DataGridValue<Cell>[]>();

  const run = () =>
    query &&
    useDBStore
      .getState()
      .execute(query)
      .then((results) =>
        results ? setResult(postgresTransformer(results)) : setResult(undefined)
      )
      .catch((err) => {
        toast.error((err as Error).message);
        setResult([]);
      });

  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col size-full p-0", className)}
      {...props}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full flex-1"
        autoSaveId="playground-layout"
      >
        {isDesktop && (
          <>
            <ResizablePanel id="database-schema" defaultSize={20} order={1}>
              <DatabaseSchema />
            </ResizablePanel>
            <ResizableHandle withHandle direction="vertical" />
          </>
        )}
        <ResizablePanel order={2}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel id="query-editor" className="flex">
              <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                <div className="flex items-center justify-between gap-2">
                  {!isDesktop && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="gap-2 text-xs"
                      onClick={() =>
                        modal.open({ children: <DatabaseSchema /> })
                      }
                    >
                      <IconTableColumn className="size-4" />
                      <span>Table</span>
                    </Button>
                  )}
                  <Button
                    size="xs"
                    onClick={run}
                    disabled={query == undefined || query.trim().length === 0}
                    className="bottom-2 right-4 z-50 gap-2 text-xs md:absolute"
                  >
                    <span>Run</span>
                    <IconPlayerPlay className="size-4" />
                  </Button>
                </div>
                <CodeEditor
                  value={query}
                  language="pgsql"
                  className="border md:border-0"
                  options={{
                    folding: isDesktop,
                    lineNumbers: isDesktop ? "on" : "off",
                    // lineNumbers:
                  }}
                  onChange={setQuery}
                  defaultLanguage="pgsql"
                />
              </div>
            </ResizablePanel>
            {result && (
              <>
                <ResizableHandle withHandle direction="vertical" />
                <ResizablePanel id="data-viewer" className="flex">
                  <DataViewer data={result} />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
});
