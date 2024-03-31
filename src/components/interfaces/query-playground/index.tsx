import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { Results } from "@electric-sql/pglite";
import { modal } from "@/components/ui/modals";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataViewer } from "@/components/ui/data-viewer";
import { ComponentProps, forwardRef, useState } from "react";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import { IconPlayerPlay, IconTableColumn } from "@tabler/icons-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const DatabaseSchema = () => {
  return (
    <div className="p-2">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, inventore
      assumenda iusto, consequatur tenetur illum asperiores repellat laudantium
      rem magnam modi molestias cum doloremque ipsam quasi ratione, suscipit
      ducimus reiciendis!
    </div>
  );
};

export const QueryPlayground = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const isDesktop = useIsDesktop();

  const [query, setQuery] = useState<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>();

  const run = async () => {
    try {
      if (query) {
        setResult(
          transformResult((await useDBStore.getState().execute(query))[0])
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transformResult = (result: Results) => {
    const column = result.fields.reduce(
      (prev, curr) => ({ ...prev, [curr.name]: "string" }),
      {}
    );

    const data = result.rows;

    return { column, data };
  };

  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col size-full p-2 md:p-0", className)}
      {...props}
    >
      <ResizablePanelGroup direction="horizontal" className="h-full flex-1">
        {isDesktop && (
          <>
            <ResizablePanel defaultSize={20} order={1}>
              <DatabaseSchema />
            </ResizablePanel>
            <ResizableHandle withHandle direction="vertical" />
          </>
        )}
        <ResizablePanel order={2}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel className="flex">
              <div className="relative flex w-full flex-col gap-y-2 md:block md:gap-y-0">
                <div className="flex items-center justify-between gap-2">
                  {!isDesktop && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="gap-2 text-xs"
                      onClick={() =>
                        modal.open({
                          children: <DatabaseSchema />,
                        })
                      }
                    >
                      <IconTableColumn className="size-4" />
                      <span>Table</span>
                    </Button>
                  )}
                  <Button
                    size="xs"
                    onClick={run}
                    className="right-2 top-2 gap-2 text-xs md:absolute"
                  >
                    <span>Run</span>
                    <IconPlayerPlay className="size-4" />
                  </Button>
                </div>
                <Textarea
                  className="h-full"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </ResizablePanel>
            {result && (
              <>
                <ResizableHandle withHandle direction="vertical" />
                <ResizablePanel className="flex">
                  <div className="flex flex-1">
                    <DataViewer column={result.column} data={result.data} />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
});
