import { useDBStore } from "@/stores";
import { cn } from "@/utils/classnames";
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
      if (active >= data.length)
        setActive(data.length > 0 ? data.length - 1 : 0);
    }, [active, data.length]);

    if (lastHistory?.error)
      return (
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-muted text-center font-mono text-xs text-destructive">
          <div>{lastHistory.error}</div>
          <div>({lastHistory?.executionTime} ms)</div>
        </div>
      );

    if (data[active])
      return (
        <div
          ref={ref}
          {...props}
          className={cn("flex flex-1 flex-col", className)}
        >
          <div className="flex size-full">
            <DataGridViewer
              data={data[active].data}
              column={data[active].column}
            />
          </div>
          <div className="flex h-8 w-full items-center justify-between border-t px-2 py-1">
            <div className="flex flex-row items-center gap-2 whitespace-nowrap font-mono text-xs">
              {data.length > 1 && (
                <Select
                  value={active.toString()}
                  onValueChange={(v) => setActive(Number(v))}
                >
                  <SelectTrigger className="h-6 gap-1 rounded-lg px-2 font-mono">
                    <SelectValue className="p-0 font-mono">
                      <span className="mr-2 text-xs">{active + 1}</span>
                      <span className="text-xs">
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
              {data.length === 1 && (
                <span>{lastHistory?.results?.[active].totalRecords} rows</span>
              )}
              <span>{lastHistory?.executionTime} ms</span>
              <span>
                {lastHistory?.results?.[active].affectedRows} affecteds
              </span>
            </div>
          </div>
        </div>
      );
  }
);
