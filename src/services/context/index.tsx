/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from "react";

import { PreferenceStorage } from "@/services/preference";
import { Preference } from "@/services/preference/preference";

export const PreferenceContext = createContext({
  preference: new Preference(),
  refresh: () => {
    // Stub function
  },
  setItem: <T extends keyof Preference>(_key: T, _value: Preference[T]) => {
    // Stub
  },
  getItem: <T extends keyof Preference>(_key: T) => {
    // Stub
  },
});

export interface PreferenceProvideProps {
  children: ReactNode;
  preference?: Preference;
}

export const PreferenceProvider = ({ children }: PreferenceProvideProps) => {
  const [loadedPreference, setLoadedPreference] = useState(new Preference());
  const [storage, setStorage] = useState<PreferenceStorage | null>(null);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const loadPreference = useCallback(async () => {
    const storage = new PreferenceStorage();
    setLoadedPreference(await storage.load());
    setStorage(storage);
  }, []);

  useEffect(() => {
    loadPreference();
  }, [loadPreference]);

  const refresh = useCallback(async () => {
    if (!storage) return;

    const pref = storage.save();
    setLoadedPreference(pref);

    // TODO: put a diffing check if any values are actually different befor forcing an update.
    // Good luck future me!

    forceUpdate();
  }, [storage, forceUpdate]);

  const setItem = useCallback(
    async function <T extends keyof Preference>(item: T, value: Preference[T], autoUpdate = true) {
      if (!storage) return;

      await storage.setItem(item, value);
      if (autoUpdate) refresh();
    },
    [refresh, storage]
  );

  const getItem = useCallback(
    function <T extends keyof Preference>(key: T) {
      if (!storage) return;

      return storage.getItem(key);
    },
    [storage]
  );

  return (
    <PreferenceContext.Provider value={{ preference: loadedPreference, refresh, getItem, setItem }}>
      {children}
    </PreferenceContext.Provider>
  );
};
