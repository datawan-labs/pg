import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PGlite, Results } from "@electric-sql/pglite";

interface DBConnection {
  name: string
  postgres: PGlite
}

interface DBMetadata {
  name: string;

  createdAt: string;

  description?: string;
}

interface DBState {
  active: DBConnection | undefined;

  databases: Record<string, DBMetadata>;

  create: (name: string, description?: string) => Promise<void>;

  change: (name: string) => Promise<void>;

  execute: (query: string) => Promise<Results[]>;
}

export const useDBStore = create<DBState>()(
  immer((set, get) => ({
    active: undefined,

    databases: {},

    create: async (name, description) => {
      if (get().databases[name])
        throw new Error(`db with name: ${name} already exists`);

      const postgres = new PGlite(`idb://${name}`);

      await postgres.waitReady;

      return set((state) => {
        state.active = {
          name: name,
          postgres: postgres
        };

        state.databases[name] = {
          name: name,
          description: description,
          createdAt: Date.now().toLocaleString(),
        };
      });
    },

    change: async (name) => {
      const postgres = new PGlite(`idb://${name}`);

      await postgres.waitReady;

      return set((state) => {
        state.active = {
          name: name,
          postgres: postgres
        }
      })
    },

    execute: async (query) => {
      const connection = get().active;

      if (!connection) throw new Error(`no active connection`);

      if (!query || !query.trim()) throw new Error(`no query to run`);

      return connection.postgres.exec(query);
    },
  }))
);
