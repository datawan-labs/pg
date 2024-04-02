import { useDBStore } from "@/stores";
import { DataViewer } from "./viewer";
import { cn } from "@/utils/classnames";
import { DatabaseSchema } from "./schema";
import { postgresTransformer } from "./utils";
import { toast } from "@/components/ui/sonner";
import { modal } from "@/components/ui/modals";
import { OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import { Cell, DataGridValue } from "@/components/ui/data-viewer";
import { useState, forwardRef, ComponentProps, useRef } from "react";
import {
  IconDotsVertical,
  IconPlayerPlay,
  IconTableColumn,
} from "@tabler/icons-react";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const QueryPlayground = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const editor = useRef<Parameters<OnMount>["0"]>();

  const isDesktop = useIsDesktop();

  const history = useDBStore((s) => s.databases[s.active!.name]?.history) || [];

  const lastQuery = history[history.length - 1]?.statement;

  const [query, setQuery] = useState<string | undefined>(lastQuery);

  const [result, setResult] = useState<DataGridValue<Cell>[]>();

  const run = () =>
    query &&
    useDBStore
      .getState()
      .execute(query)
      .then((results) => {
        results
          ? setResult(postgresTransformer(results))
          : setResult(undefined);
      })
      .catch((err) => {
        toast.error((err as Error).message);
        setResult([]);
      });

  const runSelection = () => {
    if (!editor.current) return;

    const selection = editor.current.getSelection();

    if (!selection) return toast.error("nothing to run");

    const query = editor.current.getModel()?.getValueInRange(selection);

    if (!query || query.trim().length === 0)
      return toast.error("nothing to run");

    useDBStore
      .getState()
      .execute(query)
      .then((results) => {
        results
          ? setResult(postgresTransformer(results))
          : setResult(undefined);
      })
      .catch((err) => {
        toast.error((err as Error).message);
        setResult([]);
      });
  };

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-1 flex-col size-full p-0", className)}
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
                      className="gap-1 text-xs"
                      onClick={() =>
                        modal.open({ children: <DatabaseSchema /> })
                      }
                    >
                      <IconTableColumn className="size-4" />
                      <span>Table</span>
                    </Button>
                  )}
                  <div className="bottom-2 right-4 z-50 flex items-center gap-0.5 md:absolute">
                    <Button
                      size="xs"
                      onClick={run}
                      className="gap-1 rounded-r-none text-xs"
                      disabled={query == undefined || query.trim().length === 0}
                    >
                      <span>Run</span>
                      <IconPlayerPlay className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          className="size-7 rounded-l-none"
                          disabled={query == undefined || !query.trim().length}
                        >
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={runSelection}>
                          Run Selection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                  onMount={(_editor) => {
                    editor.current = _editor;
                  }}
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
