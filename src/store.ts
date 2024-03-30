import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PGlite, Results } from "@electric-sql/pglite";

interface DBConnection {
  name: string;
  postgres: PGlite;
}

interface DBMetadata {
  name: string;

  createdAt?: string;

  description?: string;
}

interface DBState {
  active: DBConnection | undefined;

  databases: Record<string, DBMetadata>;

  create: (metadata: DBMetadata) => Promise<void>;

  remove: (name: string) => Promise<void>;

  change: (name: string) => Promise<void>;

  execute: (query: string) => Promise<Results[]>;
}

export const useDBStore = create<DBState>()(
  immer((set, get) => ({
    active: undefined,

    databases: {},

    create: async (metadata) => {
      if (get().databases[metadata.name])
        throw new Error(`db with name: ${metadata.name} already exists`);

      const postgres = new PGlite(`idb://${metadata.name}`);

      await postgres.waitReady;

      return set((state) => {
        state.active = {
          name: metadata.name,
          postgres: postgres,
        };

        state.databases[metadata.name] = {
          name: metadata.name,
          description: metadata.description,
          createdAt: Date.now().toLocaleString(),
        };
      });
    },

    remove: async (name) => {
      console.log(name);
    },

    change: async (name) => {
      const postgres = new PGlite(`idb://${name}`);

      await postgres.waitReady;

      return set((state) => {
        state.active = {
          name: name,
          postgres: postgres,
        };
      });
    },

    execute: async (query) => {
      const connection = get().active;

      if (!connection) throw new Error(`no active connection`);

      if (!query || !query.trim()) throw new Error(`no query to run`);

      return connection.postgres.exec(query);
    },
  }))
);
