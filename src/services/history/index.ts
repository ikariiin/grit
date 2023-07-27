import localForage from "localforage";

import config from "@/config";
import promisify from "@/services/utils/promisify";

import { History } from "./history";

export class HistoryStorage {
  static getStoreInstance() {
    return localForage.createInstance({
      driver: localForage.INDEXEDDB,
      version: config.STORAGE_VERSION,
      name: config.STORAGE_NAME,
      storeName: "grit-history",
    });
  }

  static getPromisifiedMethods(instance: LocalForage) {
    return {
      keys: promisify(instance.keys),
      getItem: promisify(instance.getItem<History>),
      setItem: promisify(instance.setItem<History>),
    };
  }

  constructor(private readonly history: History, private localForageInstance = HistoryStorage.getStoreInstance()) {}

  public async save(): Promise<History> {
    const store = HistoryStorage.getPromisifiedMethods(this.localForageInstance);
    return store.setItem(this.history.id, this.history);
  }

  public static async count() {
    const instance = HistoryStorage.getStoreInstance();
    const store = HistoryStorage.getPromisifiedMethods(instance);
    return (await store.keys()).length;
  }

  public static async getAll() {
    const instance = HistoryStorage.getStoreInstance();
    const store = HistoryStorage.getPromisifiedMethods(instance);
    const keys = await store.keys();

    return Promise.all(keys.map((key) => store.getItem(key))) as Promise<Array<History>>;
  }

  public static async getById(id: string) {
    const instance = HistoryStorage.getStoreInstance();
    const store = HistoryStorage.getPromisifiedMethods(instance);

    return store.getItem(id);
  }
}
