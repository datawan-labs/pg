import { PGlite } from "@electric-sql/pglite";
import { DatabaseSchema, TableType } from "@/stores";

export const getDatabaseSchema = async (
  pg: PGlite
): Promise<DatabaseSchema[]> => {
  console.time("time");

  const result = await pg.query<{
    table_name: string;
    table_type: TableType;
    table_schema: string;
  }>(`
    SELECT
      table_schema,
      table_name,
      table_type
    FROM 
      information_schema.tables;
  `);
  console.timeEnd("time");

  const schema = new Map();

  // Iterate over the Res objects
  result.rows.forEach((entry) => {
    const { table_schema, table_name, table_type } = entry;

    if (!schema.has(table_schema))
      schema.set(table_schema, {
        schema: table_schema,
        tables: [],
      });

    schema.get(table_schema).tables.push({
      table: table_name,
      type: table_type,
    });
  });

  return Array.from(schema.values()).sort((a, b) => {
    // Sort 'public' first
    if (a.schema === "public") return -1;
    if (b.schema === "public") return 1;

    // Sort anything starting with 'pg_' last
    if (a.schema.startsWith("pg_") && !b.schema.startsWith("pg_")) return 1;
    if (!a.schema.startsWith("pg_") && b.schema.startsWith("pg_")) return -1;

    // Sort alphabetically for other schema names
    return a.schema.localeCompare(b.schema);
  });
};
