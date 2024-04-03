import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { IconCopy } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ComponentProps, FC, forwardRef, useRef } from "react";
import { useCopyToClipboard } from "@/components/hooks/use-copy";

const QueryLogsStatements: FC<{ statement: string }> = ({ statement }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { copyToClipboard } = useCopyToClipboard();

  const copyQueryToKeyboard = (value?: string) => {
    if (!value) return;

    copyToClipboard(value);

    return toast.success("copied to clipboard");
  };

  return (
    <div ref={ref} className="relative overflow-hidden">
      <Button
        size="icon"
        variant="outline"
        className="absolute right-2 top-0 z-10 size-7"
        onClick={() => copyQueryToKeyboard(statement)}
      >
        <IconCopy className="size-3" />
      </Button>
      <CodeEditor
        language="pgsql"
        value={statement}
        options={{
          folding: false,
          readOnly: true,
          lineNumbers: "off",
          automaticLayout: true,
          overviewRulerLanes: 0,
          lineNumbersMinChars: 0,
          lineDecorationsWidth: 0,
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
        }}
        onMount={(editor) => {
          editor.onDidContentSizeChange(() => {
            const contentHeight = Math.min(1000, editor.getContentHeight());
            if (ref.current) ref.current.style.height = `${contentHeight}px`;
          });
        }}
      />
    </div>
  );
};

export const QueryHistory = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const logs = useDBStore((s) => s.databases[s.active!.name].history);

    const reversed = logs.slice().reverse();

    return (
      <div
        ref={ref}
        className={cn("flex flex-col size-full gap-2 overflow-auto", className)}
        {...props}
      >
        {reversed.map((log, idx) => (
          <div key={idx} className="container m-auto flex flex-row gap-2 p-2">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full",
                  log.error ? "bg-destructive" : "bg-primary"
                )}
              >
                <div className="size-3 rounded-full bg-background" />
              </div>
              {idx !== reversed.length - 1 && (
                <div
                  className={cn(
                    "border-1 flex-1 border-r border-dashed",
                    log.error ? "border-destructive/50" : "border-primary/50"
                  )}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-sm border bg-background p-2 shadow-sm">
              <div className="flex flex-row items-center justify-between gap-2 border-b py-2 font-mono">
                <div className="text-xs font-bold">{log.createdAt}</div>
                <Badge>{log.executionTime} ms</Badge>
              </div>
              <div className="flex flex-col gap-2 lg:flex-row">
                <div className="flex-1 lg:overflow-hidden">
                  <QueryLogsStatements statement={log.statement} />
                </div>
                <ul className="flex-1 space-y-2 lg:border-l lg:pl-2">
                  {log.error && (
                    <li className="rounded-sm bg-destructive p-2 font-mono text-xs text-destructive-foreground">
                      {log.error}
                    </li>
                  )}
                  {log.results?.map((r) => (
                    <li className="rounded-sm border bg-muted p-2 font-mono text-xs">
                      <span>affected rows: {r.affectedRows}, </span>
                      <span>total records: {r.totalRecords}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);
