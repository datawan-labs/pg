import { useDBStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconReload,
  IconTable,
  IconTableAlias,
  IconTableColumn,
} from "@tabler/icons-react";

export const DatabaseSchema = () => {
  const schema = useDBStore((s) => s.databases[s.active!.name].schema);

  return (
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
        <Accordion type="multiple" className="w-full" defaultValue={["public"]}>
          {schema?.map((s) => (
            <AccordionItem
              key={s.schema}
              value={s.schema}
              className="border-none"
            >
              <AccordionTrigger className="py-2">
                <div className="flex flex-row items-center gap-x-2">
                  <IconTableAlias className="size-4" />
                  <div className="text-sm font-medium">{s.schema}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <Accordion
                  type="multiple"
                  className="w-full"
                  defaultValue={
                    s.schema === "public" ? s.tables.map((t) => t.table) : []
                  }
                >
                  {s.tables?.map((t) => (
                    <AccordionItem
                      key={t.table}
                      value={t.table}
                      className="ml-7 border-none"
                    >
                      <AccordionTrigger className="py-1">
                        <div className="flex flex-row items-center gap-2">
                          {t.type === "BASE TABLE" ? (
                            <IconTableColumn className="size-4" />
                          ) : (
                            <IconTable className="size-4 text-secondary-foreground" />
                          )}
                          <div className="text-sm">{t.table}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        {t.columns.map((c) => (
                          <div
                            key={c.column}
                            className="ml-6 flex flex-row items-center justify-between gap-2"
                          >
                            <div className="flex-1 font-medium">{c.column}</div>
                            <div className="line-clamp-1 font-mono text-xs font-light">
                              {c.type} {c.length && `(${c.length})`}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
