import { FC } from "react";
import { DatabaseSchema, useDBStore } from "@/stores";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  IconTable,
  IconTableAlias,
  IconTableColumn,
} from "@tabler/icons-react";

const SchemaTree: FC<{ schema: DatabaseSchema }> = ({ schema }) => (
  <AccordionItem
    key={schema.schema}
    value={schema.schema}
    className="border-none"
  >
    <AccordionTrigger className="py-2">
      <div className="flex flex-row items-center gap-x-2">
        <IconTableAlias className="size-4" />
        <div className="font-medium text-sm">{schema.schema}</div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="pb-0">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={
          schema.schema === "public" ? schema.tables.map((t) => t.table) : []
        }
      >
        {schema.tables?.map((t) => (
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
                  <IconTable className="size-4" />
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
                  <div className="line-clamp-1 font-light font-mono text-xs">
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
);

const SchemaTreeRoot: FC<{ schemas?: DatabaseSchema[] }> = ({ schemas }) => (
  <Accordion type="multiple" className="w-full" defaultValue={["public"]}>
    {schemas?.map((s) => (
      <SchemaTree schema={s} key={s.schema} />
    ))}
  </Accordion>
);

export const AllDatabaseSchemaTree = () => {
  const schema = useDBStore((s) => s.databases[s.active!.name].schema);

  return <SchemaTreeRoot schemas={schema} />;
};

export const PublicSchemaTree = () => {
  const schema = useDBStore((s) => s.databases[s.active!.name].schema);

  /**
   * we only show schema except from postgre internal database
   */
  const erdSchema = schema?.filter(
    (s) => !s.schema.startsWith("pg_") && s.schema !== "information_schema"
  );

  return <SchemaTreeRoot schemas={erdSchema} />;
};
