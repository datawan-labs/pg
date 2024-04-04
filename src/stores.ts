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

  reload: () => Promise<void>;
}

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

      execute: async (query) => {
        const connection = get().active!;

        const startTime = performance.now();
        const createdAt = new Date().toLocaleString();

        try {
          if (!query || !query.trim()) throw new Error(`no query to run`);

          const result = await connection.postgres.exec(query);

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
    }
  )
);
