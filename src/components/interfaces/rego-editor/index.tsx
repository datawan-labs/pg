import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { toast } from "@/components/ui/sonner";
import { OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { forwardRef, ComponentProps, useRef } from "react";
import { IconPlayerPlay } from "@tabler/icons-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const RegoEditor = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const editor = useRef<Parameters<OnMount>["0"]>();
    const inputEditor = useRef<Parameters<OnMount>["0"]>();

    const query = useDBStore((s) => s.databases[s.active!.name].rego);
    const input = useDBStore((s) =>
      JSON.stringify(s.databases[s.active!.name].input, null, 2),
    );
    const evaluated = useDBStore((s) => {
      const res = s.databases[s.active!.name].evaluated;
      if (!res) return;
      return JSON.stringify(res, null, 2);
    });

    const setQuery = (rego: string | undefined) =>
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

    const evalQuery = () =>
      query &&
      useDBStore
        .getState()
        .evaluate(query)
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
          <ResizablePanel id="main-editor" order={2}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel id="query-editor" className="flex">
                <div className="relative flex w-full flex-col gap-y-2 p-2 md:block md:gap-y-0 md:p-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="right-4 bottom-2 z-50 flex items-center gap-0.5 md:absolute">
                      <Button
                        size="xs"
                        onClick={evalQuery}
                        className="gap-1 text-xs md:rounded"
                        disabled={
                          query == undefined || query.trim().length === 0
                        }
                      >
                        <span>Evaluate</span>
                        <IconPlayerPlay className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <CodeEditor
                    value={query}
                    language="rego"
                    onChange={setQuery}
                    className="bg-muted"
                    defaultLanguage="rego"
                    onMount={(_editor) => {
                      editor.current = _editor;
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
                    value={input}
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
                  <ResizablePanel id="eval-viewer" className="flex">
                    <CodeEditor
                      value={evaluated}
                      language="json"
                      className="bg-muted"
                      defaultLanguage="json"
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
