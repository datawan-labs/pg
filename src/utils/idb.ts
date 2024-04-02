import { StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

export const zustandIDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

/**
 * remove item from indexedDB by key
 *
 * @param {String} name
 * @returns
 */
export const removeIDBItem = (name: string) => indexedDB.deleteDatabase(name);

/**
 * this is the key of indexedDB generated from from postgres
 *
 * @param {String} name
 * @returns
 */
export const postgreIDBName = (name: string) => `/pglite/${name}`;

/**
 * and this how pglite make connection to data in
 * indexedDB
 *
 * @param {String} name
 * @returns
 */
export const postgreIDBConnection = (name: string) => `idb://${name}`;
