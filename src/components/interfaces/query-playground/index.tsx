import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { DataViewer } from "./data-viewer";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { modal } from "@/components/ui/modals";
import { OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { forwardRef, ComponentProps, useRef } from "react";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import { AllDatabaseSchemaTree } from "@/components/interfaces/schema-tree";
import {
  IconReload,
  IconPlayerPlay,
  IconTableColumn,
  IconDotsVertical,
} from "@tabler/icons-react";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const QueryPlayground = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const isDesktop = useIsDesktop();

  const editor = useRef<Parameters<OnMount>["0"]>();

  const query = useDBStore((s) => s.databases[s.active!.name].query);

  const datagrid = useDBStore((s) => s.databases[s.active!.name].datagrid);

  const setQuery = (query: string | undefined) =>
    useDBStore.setState((s) => {
      s.databases[s.active!.name].query = query;
    });

  const runAllQuery = () =>
    query &&
    useDBStore
      .getState()
      .execute(query)
      .then(() => toast.success("completed", { duration: 500 }))
      .catch((err) => toast.error((err as Error).message, { duration: 500 }));

  const runSelectedQuery = () => {
    if (!editor.current) return;

    const selection = editor.current.getSelection();

    if (!selection) return toast.error("nothing to run");

    const query = editor.current.getModel()?.getValueInRange(selection);

    if (!query || query.trim().length === 0)
      return toast.error("nothing to run");

    useDBStore
      .getState()
      .execute(query)
      .then(() => toast.success("completed", { duration: 500 }))
      .catch((err) => toast.error((err as Error).message, { duration: 500 }));
  };

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
            <ResizablePanel id="database-schema" defaultSize={20} order={1}>
              <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
                <div className="flex flex-row items-center justify-between border-b py-1">
                  <Label>Schema</Label>
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
                  <AllDatabaseSchemaTree />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle direction="vertical" />
          </>
        )}
        <ResizablePanel id="main-editor" order={2}>
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
                        modal.open({ children: <AllDatabaseSchemaTree /> })
                      }
                    >
                      <IconTableColumn className="size-4" />
                      <span>Table</span>
                    </Button>
                  )}
                  <div className="right-4 bottom-2 z-50 flex items-center gap-0.5 md:absolute">
                    <Button
                      size="xs"
                      onClick={runAllQuery}
                      className="gap-1 text-xs md:rounded-r-none"
                      disabled={query == undefined || query.trim().length === 0}
                    >
                      <span>Run</span>
                      <IconPlayerPlay className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="hidden md:flex">
                        <Button
                          size="icon"
                          className="size-7 rounded-l-none"
                          disabled={query == undefined || !query.trim().length}
                        >
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={runSelectedQuery}>
                          Run Selection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CodeEditor
                  value={query}
                  language="pgsql"
                  onChange={setQuery}
                  className="bg-muted"
                  defaultValue="SELECT * FROM information_schema.tables"
                  defaultLanguage="pgsql"
                  onMount={(_editor, monaco) => {
                    editor.current = _editor;

                    editor.current.addCommand(
                      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                      runSelectedQuery
                    );
                  }}
                  options={{
                    folding: isDesktop,
                    lineNumbers: isDesktop ? "on" : "off",
                  }}
                />
              </div>
            </ResizablePanel>
            {datagrid && (
              <>
                <ResizableHandle withHandle direction="vertical" />
                <ResizablePanel id="data-viewer" className="flex">
                  <DataViewer data={datagrid} />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
});
