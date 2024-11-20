import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Results, PGlite } from "@electric-sql/pglite";
import { postgresTransformer } from "@/utils/postgres";
import { createJSONStorage, persist } from "zustand/middleware";
import { Cell, DataGridValue } from "@/components/ui/data-viewer";
import { generateMermaidErd, getDatabaseSchema } from "@/postgres/setup";
import {
  SampleDataMeta,
  SampleDatakey,
  getSampleDatabaseQuery,
} from "@/postgres/sample-data";
import {
  removeIDBItem,
  postgreIDBName,
  zustandIDBStorage,
  postgreIDBConnection,
} from "@/utils/idb";

interface Connection {
  name: string;
  postgres: PGlite;
}

export interface QueryResult {
  affectedRows: number;
  totalRecords?: number;
}

export interface QueryHistory {
  error?: string;
  statement: string;
  createdAt?: string;
  executionTime?: number; // ms
  results?: QueryResult[];
}

export type TableType = "BASE TABLE" | "VIEW";

export type TableColumn = {
  type: string;
  column: string;
  nullable: boolean;
  length: string | null;
};

export interface DatabaseSchema {
  schema: string;
  tables: {
    table: string;
    type: TableType;
    columns: TableColumn[];
  }[];
}

export interface Database {
  name: string;

  createdAt?: string;

  description?: string;

  history: QueryHistory[];

  schema: DatabaseSchema[];

  /**
   * we are using mermaid js syntax
   * to generating erd
   */
  erd: string;

  query?: string;

  rego?: string;

  evaluated?: string;

  datagrid?: DataGridValue<Cell>[];
}

interface State {
  active: Connection | undefined;

  databases: Record<string, Database>;

  create: (data: Pick<Database, "name" | "description">) => Promise<void>;

  update: (name: string, data: Pick<Database, "description">) => Promise<void>;

  import: (data: SampleDataMeta<SampleDatakey>) => Promise<void>;

  remove: (name: string) => Promise<void>;

  connect: (name: string) => Promise<void>;

  execute: (query: string) => Promise<Results[] | undefined>;

  evaluate: (rego: string) => Promise<Record<string, any> | undefined>;

  reload: () => Promise<void>;
}

// NOTE(sr):
// 1. "conditions" and "query" is a must
// 2. we need the rego.v1 import because the Preview API has no "v1" flag
// 3. we cannot use the condensed ucast format just yet -- the builtin doesn't
//    know how to expand that
const defaultRego = `package conditions
import rego.v1
filter := {"type": "compound", "operator": "and", "value": [
	{"type": "field", "operator": "eq", "field": "name", "value": "bob"},
	{"type": "field", "operator": "gt", "field": "salary", "value": 50000},
]}
query := ucast.as_sql(filter, "postgres", {})`;

export const useDBStore = create<State>()(
  persist(
    immer((set, get) => ({
      active: undefined,

      databases: {},

      create: async (data) => {
        if (get().databases[data.name])
          throw new Error(`db with name: ${data.name} already exists`);

        const postgres = new PGlite(postgreIDBConnection(data.name));

        const schema = await getDatabaseSchema(postgres);

        const erd = await generateMermaidErd(postgres);

        return set((state) => {
          state.active = {
            name: data.name,
            postgres: postgres,
          };

          state.databases[data.name] = {
            name: data.name,
            description: data.description,
            createdAt: new Date().toLocaleString(),
            query: "SELECT * FROM information_schema.tables",
            rego: defaultRego,
            history: [],
            erd: erd,
            schema: schema,
          };
        });
      },

      update: async (name, data) =>
        set((state) => {
          state.databases[name].description = data.description;

          state.databases[name].createdAt = new Date().toLocaleString();
        }),

      import: async (data) => {
        const sql = await getSampleDatabaseQuery(data.key);

        /**
         * name with random 5 digit string
         */
        const name = `${data.key}-${Math.floor(Math.random() * 90000) + 10000}`;

        const postgres = new PGlite(postgreIDBConnection(name));

        /**
         * import data
         */
        await postgres.exec(sql);

        const schema = await getDatabaseSchema(postgres);

        const erd = await generateMermaidErd(postgres);

        set((state) => {
          state.active = {
            name: name,
            postgres: postgres,
          };

          state.databases[name] = {
            name: name,
            description: data.description,
            createdAt: new Date().toLocaleString(),
            query: "SELECT * FROM information_schema.tables",
            rego: defaultRego,
            history: [],
            erd: erd,
            schema: schema,
          };
        });
      },

      remove: async (name) => {
        set((state) => {
          state.active = undefined;

          delete state.databases[name];
        });

        removeIDBItem(postgreIDBName(name));
      },

      connect: async (name) => {
        const postgres = new PGlite(postgreIDBConnection(name));

        const schema = await getDatabaseSchema(postgres);

        const erd = await generateMermaidErd(postgres);

        return set((state) => {
          state.active = {
            name: name,
            postgres: postgres,
          };

          state.databases[name].erd = erd;
          state.databases[name].schema = schema;
        });
      },

      evaluate: async (rego) => {
        const connection = get().active!;

        // Playground. Needs no backend but has no ucast builtins.
        // const req = {
        //   input: {},
        //   data: {},
        //   rego_modules: {
        //     "main.rego": rego,
        //   },
        //   rego_version: 1,
        // };
        // const resp = await fetch("https://play.openpolicyagent.org/v1/data", {
        //   method: "POST",
        //   body: JSON.stringify(req),
        // });

        // EOPA Preview API
        const req = {
          input: {},
          data: {},
          rego_modules: {
            "main.rego": rego,
          },
        };
        const resp = await fetch("/v0/preview/conditions", {
          method: "POST",
          body: JSON.stringify(req),
        });
        const result = await resp.json();
        set((state) => {
          state.databases[connection.name].rego = rego;
          state.databases[connection.name].evaluated = result?.result?.query;
        });
        return result;
      },

      execute: async (query) => {
        const connection = get().active!;

        const startTime = performance.now();
        const createdAt = new Date().toLocaleString();

        const evaluated = get().databases[connection.name].evaluated;

        try {
          if (!query || !query.trim()) throw new Error(`no query to run`);
          const query0 = query + " " + evaluated;

          const result = await connection.postgres.exec(query0);

          set((state) => {
            state.databases[connection.name].query = query;

            state.databases[connection.name].datagrid =
              postgresTransformer(result);

            state.databases[connection.name].history.push({
              statement: query,
              createdAt: createdAt,
              executionTime: performance.now() - startTime,
              results: result.map((r) => ({
                affectedRows: r.affectedRows || 0,
                totalRecords: r.rows.length || 0,
              })),
            });
          });

          return result;
        } catch (error) {
          set((state) => {
            state.databases[connection.name].query = query;

            state.databases[connection.name].datagrid = [];

            state.databases[connection.name].history.push({
              statement: query,
              createdAt: createdAt,
              error: (error as Error).message,
              executionTime: performance.now() - startTime,
            });
          });

          throw error;
        }
      },

      reload: async () => {
        const connection = get().active!;

        const schema = await getDatabaseSchema(connection.postgres);

        const erd = await generateMermaidErd(connection.postgres);

        set((state) => {
          state.databases[connection.name].erd = erd;
          state.databases[connection.name].schema = schema;
        });
      },
    })),
    {
      name: "zustand-store",
      storage: createJSONStorage(() => zustandIDBStorage),
      partialize: (state) => ({ databases: state.databases }),
    },
  ),
);
