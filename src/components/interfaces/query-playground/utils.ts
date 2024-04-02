import { types } from "@electric-sql/pglite";
import { Results } from "@electric-sql/pglite";
import {
  Cell,
  Column,
  ColumnType,
  DataGridValue,
} from "@/components/ui/data-viewer";

const columnTransformer: Record<number, ColumnType> = {
  [types.UUID]: "id",
  [types.CHAR]: "string",
  [types.BOOL]: "string",
  [types.INT2]: "number",
  [types.INT4]: "number",
  [types.INT8]: "number",
  [types.FLOAT4]: "number",
  [types.FLOAT8]: "number",
};

// const valueTransformer: Record

export const postgresTransformer = (results: Results[]): DataGridValue<Cell>[] =>
  results
    .filter((result) => result.rows !== undefined)
    .map((result) => {
      const column = result.fields.reduce((prev, curr) => {
        const type = columnTransformer[curr.dataTypeID] || "string";

        return { ...prev, [curr.name]: type } as Column<Cell>;
      }, {} as Column<Cell>);

      const data = result.rows?.map((row) => {
        for (const key in column) {
          if (!row[key]) continue;

          switch (typeof row[key]) {
            case "string":
            case "number":
              continue;
            case "object":
              row[key] = JSON.stringify(row[key]);
              continue;
          }

          if (Array.isArray(row[key])) row[key] = JSON.stringify(row[key]);
        }

        return row;
      });

      return { column, data };
    });
