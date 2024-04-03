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

/**
 * I do not write this query, thanks to Pavlo Golub from
 * this posts https://www.cybertec-postgresql.com/en/er-diagrams-with-sql-and-mermaid/
 */
export const generateMermaidErd = async (pg: PGlite): Promise<string> => {
  const result = await pg.query<{ "?column?": string }>(`
    SELECT 'erDiagram'
      UNION ALL
      SELECT
          FORMAT(E'\t%s{\n%s\n}', 
              c.relname, 
              STRING_AGG(FORMAT(E'\t\t~%s~ %s', 
                  FORMAT_TYPE(t.oid, a.atttypmod), 
                  a.attname
              ), E'\n'))
      FROM
          pg_class c 
          JOIN pg_namespace n ON n.oid = c.relnamespace
          LEFT JOIN pg_attribute a ON c.oid = a.attrelid AND a.attnum > 0 AND NOT a.attisdropped
          LEFT JOIN pg_type t ON a.atttypid = t.oid
      WHERE
          c.relkind IN ('r', 'p') 
          AND NOT c.relispartition
          AND n.nspname !~ '^pg_' AND n.nspname <> 'information_schema'
      GROUP BY c.relname
      UNION ALL
      SELECT
          FORMAT('%s }|..|| %s : %s', c1.relname, c2.relname, c.conname)
      FROM
          pg_constraint c
          JOIN pg_class c1 ON c.conrelid = c1.oid AND c.contype = 'f'
          JOIN pg_class c2 ON c.confrelid = c2.oid
      WHERE
          NOT c1.relispartition AND NOT c2.relispartition;
  `);

  return result.rows.map((i) => i["?column?"]).join("\n");
};
