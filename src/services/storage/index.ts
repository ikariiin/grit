import localForage from "localforage";

import config from "@/config";
import { Entry } from "@/services/storage/entry";
import promisify from "@/services/utils/promisify";

export class Storage {
  static getStoreInstance() {
    return localForage.createInstance({
      driver: localForage.INDEXEDDB,
      version: config.STORAGE_VERSION,
      name: config.STORAGE_NAME,
      storeName: "grit-store",
    });
  }

  static getPromisifiedMethods(instance: LocalForage) {
    return {
      keys: promisify(instance.keys),
      getItem: promisify(instance.getItem<Entry>),
      setItem: promisify(instance.setItem<Entry>),
    };
  }

  constructor(private readonly entry: Entry, private localForageInstance = Storage.getStoreInstance()) {}

  public async save(): Promise<Entry> {
    const store = Storage.getPromisifiedMethods(this.localForageInstance);
    return store.setItem(this.entry.id, this.entry);
  }

  public static async getAll() {
    const instance = Storage.getStoreInstance();
    const store = Storage.getPromisifiedMethods(instance);
    const keys = await store.keys();

    return Promise.all(keys.map((key) => store.getItem(key))) as Promise<Array<Entry>>;
  }

  public static async getBook(id: string) {
    const instance = Storage.getStoreInstance();
    const store = Storage.getPromisifiedMethods(instance);

    return store.getItem(id);
  }
}
