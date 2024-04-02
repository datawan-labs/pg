import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useState } from "react";
import {
  Cell,
  DataGridValue,
  DataViewer as DataGridViewer,
} from "@/components/ui/data-viewer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DataGridValue<Cell>[];
}

export const DataViewer = forwardRef<HTMLDivElement, DataViewerProps>(
  ({ className, data, ...props }, ref) => {
    /**
     * set last result as active
     */
    const [active, setActive] = useState(data.length > 0 ? data.length - 1 : 0);

    const history = useDBStore((s) => s.databases[s.active!.name]?.history);

    const lastHistory = history ? history[history.length - 1] : undefined;

    useEffect(() => {
      if (active >= data.length) setActive(data.length - 1);
    }, [active, data.length]);

    return (
      <div
        ref={ref}
        className={cn("flex flex-1 flex-col", className)}
        {...props}
      >
        <div className="flex size-full">
          {data[active] && (
            <DataGridViewer
              data={data[active].data}
              column={data[active].column}
            />
          )}
        </div>
        <div className="flex h-8 w-full items-center justify-between border-t px-2 py-1">
          {lastHistory?.error === undefined &&
            lastHistory?.results?.[active] && (
              <div className="flex flex-row items-center gap-2">
                {data.length > 1 && (
                  <Select
                    value={active.toString()}
                    onValueChange={(v) => setActive(Number(v))}
                  >
                    <SelectTrigger className="h-6 gap-1 rounded-lg px-2 font-mono">
                      <SelectValue
                        className="p-0 font-mono"
                        placeholder="result"
                      >
                        <span className="mr-2 text-[0.6rem]">
                          result {active + 1}
                        </span>
                        <span className="text-[0.6rem]">
                          ({lastHistory?.results?.[active]?.totalRecords})
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: data.length }).map((_, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          <span>result {idx + 1}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="flex flex-row items-center gap-2 whitespace-nowrap text-[0.6rem]">
                  {data.length === 1 && (
                    <span>
                      {lastHistory?.results?.[active].totalRecords} rows
                    </span>
                  )}
                  <span>{lastHistory?.executionTime} ms</span>
                  <span>
                    {lastHistory?.results?.[active].affectedRows} affecteds
                  </span>
                </div>
              </div>
            )}
          {lastHistory?.error && (
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-[0.6rem]">
                query run with error
              </span>
              <Button
                size="xs"
                variant="outline"
                className="h-6 text-[0.6rem]"
                onClick={() => toast.error(lastHistory.error)}
              >
                show error
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
