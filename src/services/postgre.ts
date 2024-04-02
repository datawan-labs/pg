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
    table_columns: {
      type: string;
      column: string;
      length: string | null;
      nullable: "YES" | "NO";
    }[];
  }>(`
    SELECT
      t.table_schema,
      t.table_type,
      t.table_name,
      json_agg(json_build_object('column', c.column_name, 
                                'type', c.data_type,
                                'length', c.character_maximum_length,
                                'nullable', c.is_nullable)) AS table_columns
    FROM 
      information_schema.tables t
    JOIN 
      information_schema.columns c ON t.table_name = c.table_name
    GROUP BY 
      t.table_schema, 
      t.table_name,
      t.table_type;
  `);
  console.timeEnd("time");

  const schema = new Map();

  // Iterate over the Res objects
  result.rows.forEach((entry) => {
    const { table_schema, table_name, table_type, table_columns } = entry;

    if (!schema.has(table_schema))
      schema.set(table_schema, {
        schema: table_schema,
        tables: [],
      });

    schema.get(table_schema).tables.push({
      table: table_name,
      type: table_type,
      columns: table_columns.map((c) => ({
        type: c.type,
        column: c.column,
        length: c.length,
        nullable: c.nullable === "YES",
      })),
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
