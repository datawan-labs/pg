import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { DataViewer } from "../query-playground/data-viewer";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { forwardRef, ComponentProps } from "react";
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
import { IconPlayerPlay, IconDotsVertical } from "@tabler/icons-react";

export const RegoEditor = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const query = useDBStore((s) => s.databases[s.active!.name].query);
    const rego = useDBStore((s) => s.databases[s.active!.name].rego);
    const datagrid = useDBStore((s) => s.databases[s.active!.name].datagrid);
    const input = useDBStore((s) =>
      JSON.stringify(s.databases[s.active!.name].input, null, 2),
    );
    const data = useDBStore((s) =>
      JSON.stringify(s.databases[s.active!.name].data, null, 2),
    );
    const evaluated = useDBStore((s) => {
      const res = s.databases[s.active!.name].evaluated;
      if (!res) return;
      return JSON.stringify(res, null, 2);
    });

    const setRego = (rego: string | undefined) =>
      useDBStore.setState((s) => {
        s.databases[s.active!.name].rego = rego;
      });

    const setInput = (input: string | undefined) =>
      useDBStore.setState((s) => {
        try {
          s.databases[s.active!.name].input = input ? JSON.parse(input) : {};
        } catch (err) {
          // NOTE(sr): too noisy, we don't debounce setInput; better ignore parse errors
          // toast.error((err as Error).message, { duration: 2000 });
        }
      });

    const setData = (data: string | undefined) =>
      useDBStore.setState((s) => {
        try {
          s.databases[s.active!.name].data = data ? JSON.parse(data) : {};
        } catch (err) {
          // NOTE(sr): too noisy, see setInput above
        }
      });

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

    const runAllQueryFiltered = () =>
      query &&
      useDBStore
        .getState()
        .execute(query, rego, true)
        .then(() => toast.success("completed", { duration: 500 }))
        .catch((err) => toast.error((err as Error).message, { duration: 500 }));

    const evalQuery = () =>
      rego &&
      useDBStore
        .getState()
        .evaluate(rego)
        .then(() => toast.success("completed", { duration: 500 }))
        .catch((err) =>
          toast.error((err as Error).message, { duration: 2000 }),
        );

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
          <ResizablePanel id="editor" order={1}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel id="query-editor" className="flex">
                <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="right-4 bottom-2 z-50 flex items-center gap-0.5 md:absolute">
                      <Button
                        size="xs"
                        onClick={runAllQueryFiltered}
                        className="gap-1 text-xs md:rounded-r-none"
                        disabled={
                          query == undefined || query.trim().length === 0
                        }
                      >
                        <span>Run</span>
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
                          <DropdownMenuItem onClick={runAllQuery}>
                            Run Unfiltered
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="p-1 font-semibold">SQL</div>
                  <CodeEditor
                    value={query}
                    language="pgsql"
                    onChange={setQuery}
                    className="bg-muted"
                    defaultLanguage="pgsql"
                    options={{
                      folding: true,
                      lineNumbers: "on",
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
          <ResizableHandle withHandle direction="horizontal" />
          <ResizablePanel id="rego-editor" order={2}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel id="rego-query-editor" className="flex">
                <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="right-4 bottom-2 z-50 flex items-center gap-0.5 md:absolute">
                      <Button
                        size="xs"
                        onClick={evalQuery}
                        className="gap-1 text-xs md:rounded"
                        disabled={rego == undefined || rego.trim().length === 0}
                      >
                        <span>Evaluate</span>
                        <IconPlayerPlay className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-1 font-semibold">Rego</div>
                  <CodeEditor
                    value={rego}
                    language="rego"
                    onChange={setRego}
                    className="bg-muted"
                    defaultLanguage="rego"
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
                  <div className="p-1 font-semibold">Input</div>
                  <CodeEditor
                    value={input}
                    language="json"
                    onChange={setInput}
                    className="bg-muted"
                    defaultLanguage="json"
                    options={{
                      folding: true,
                      lineNumbers: "off",
                    }}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle direction="vertical" />
              <ResizablePanel id="data-editor" className="flex">
                <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                  <div className="p-1 font-semibold">Data</div>
                  <CodeEditor
                    value={data}
                    language="json"
                    onChange={setData}
                    className="bg-muted"
                    defaultLanguage="json"
                    options={{
                      folding: true,
                      lineNumbers: "off",
                    }}
                  />
                </div>
              </ResizablePanel>
              {evaluated && (
                <>
                  <ResizableHandle withHandle direction="vertical" />
                  <ResizablePanel id="eval-viewer" className="flex">
                    <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                      <div className="p-1 font-semibold">Evaluated</div>
                      <CodeEditor
                        value={evaluated}
                        language="json"
                        className="bg-muted"
                        defaultLanguage="json"
                        options={{
                          folding: true,
                          lineNumbers: "off",
                        }}
                      />
                    </div>
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
