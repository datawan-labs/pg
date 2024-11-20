import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { toast } from "@/components/ui/sonner";
import { OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { forwardRef, ComponentProps, useRef } from "react";
import { IconPlayerPlay, IconDotsVertical } from "@tabler/icons-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export const RegoEditor = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const editor = useRef<Parameters<OnMount>["0"]>();
    const inputEditor = useRef<Parameters<OnMount>["0"]>();

    const query = useDBStore((s) => s.databases[s.active!.name].rego);
    const evaluated = useDBStore((s) => s.databases[s.active!.name].evaluated);

    const setQuery = (rego: string | undefined) =>
      useDBStore.setState((s) => {
        s.databases[s.active!.name].rego = rego;
      });

    const setInput = (input: string | undefined) =>
      useDBStore.setState((s) => {
        s.databases[s.active!.name].input = input ? JSON.parse(input) : {};
      });

    const evalQuery = () =>
      query &&
      useDBStore
        .getState()
        .evaluate(query)
        .then(() => toast.success("completed", { duration: 500 }))
        .catch((err) => toast.error((err as Error).message, { duration: 500 }));

    const runSelectedQuery = () => {
      if (!editor.current) return;

      const selection = editor.current.getSelection();

      if (!selection)
        return toast.error("no selected query to run", { duration: 1000 });

      const query = editor.current.getModel()?.getValueInRange(selection);

      if (!query || query.trim().length === 0)
        return toast.error("no selected query to run", { duration: 1000 });

      useDBStore
        .getState()
        .evaluate(query)
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
          <ResizablePanel id="main-editor" order={2}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel id="query-editor" className="flex">
                <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="right-4 bottom-2 z-50 flex items-center gap-0.5 md:absolute">
                      <Button
                        size="xs"
                        onClick={evalQuery}
                        className="gap-1 text-xs md:rounded-r-none"
                        disabled={
                          query == undefined || query.trim().length === 0
                        }
                      >
                        <span>Evaluate</span>
                        <IconPlayerPlay className="size-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="hidden md:flex">
                          <Button
                            size="icon"
                            className="size-7 rounded-l-none"
                            disabled={
                              query == undefined || !query.trim().length
                            }
                          >
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={runSelectedQuery}>
                            Evaluate Selection
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CodeEditor
                    value={query}
                    language="rego"
                    onChange={setQuery}
                    className="bg-muted"
                    defaultLanguage="rego"
                    onMount={(_editor, monaco) => {
                      editor.current = _editor;

                      editor.current.addCommand(
                        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                        runSelectedQuery,
                      );
                    }}
                    options={{
                      folding: true,
                      lineNumbers: "on",
                    }}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle direction="vertical" />
              <ResizablePanel id="input-editor" className="flex">
                <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                  <CodeEditor
                    value="{}"
                    language="json"
                    onChange={setInput}
                    className="bg-muted"
                    defaultLanguage="json"
                    onMount={(editor) => {
                      inputEditor.current = editor;
                    }}
                    options={{
                      folding: true,
                      lineNumbers: "on",
                    }}
                  />
                </div>
              </ResizablePanel>
              {evaluated && (
                <>
                  <ResizableHandle withHandle direction="vertical" />
                  <ResizablePanel id="data-viewer" className="flex">
                    <CodeEditor
                      value={evaluated}
                      language="pgsql"
                      className="bg-muted"
                      defaultLanguage="pgsql"
                    />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  },
);
