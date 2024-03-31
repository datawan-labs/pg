import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PGlite, Results } from "@electric-sql/pglite";
import { createJSONStorage, persist } from "zustand/middleware";
import { postgreIDBConnection, postgreIDBName, removeItem, zustandStorage } from "./utils/idb";

interface DBConnection {
  name: string;
  postgres: PGlite;
}

export interface DBMetadata {
  name: string;

  createdAt?: string;

  description?: string;
}

interface DBState {
  active: DBConnection | undefined;

  databases: Record<string, DBMetadata>;

  create: (metadata: DBMetadata) => Promise<void>;

  update: (name: string, metadata: Omit<DBMetadata, "name">) => Promise<void>;

  remove: (name: string) => Promise<void>;

  connect: (name: string) => Promise<void>;

  execute: (query: string) => Promise<Results[]>;
}

export const useDBStore = create<DBState>()(
  persist(
    immer((set, get) => ({
      active: undefined,

      databases: {},

      create: async (metadata) => {
        if (get().databases[metadata.name])
          throw new Error(`db with name: ${metadata.name} already exists`);

        const postgres = new PGlite(postgreIDBConnection(metadata.name));

        await postgres.waitReady;

        return set((state) => {
          state.active = {
            name: metadata.name,
            postgres: postgres,
          };

          state.databases[metadata.name] = {
            name: metadata.name,
            description: metadata.description,
            createdAt: new Date().toLocaleString(),
          };
        });
      },

      update: async (name, metadata) =>
        set((state) => {
          state.databases[name].description = metadata.description;

          state.databases[name].createdAt = new Date().toLocaleString();
        }),

      remove: async (name) => {
        set((state) => {
          state.active = undefined;

          delete state.databases[name];
        });

        removeItem(postgreIDBName(name))

      },

      connect: async (name) => {
        const postgres = new PGlite(postgreIDBConnection(name));

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
    })),
    {
      name: "zustand-store",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ databases: state.databases }),
    }
  )
);
