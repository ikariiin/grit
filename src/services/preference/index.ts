import { Preference, Theme } from "@/services/preference/preference";

export class PreferenceStorage {
  constructor(private preference: Preference = new Preference()) {}

  public save() {
    Object.entries(this.preference).map(([key, value]) => {
      localStorage.setItem(key, value);
    });
    return this.preference;
  }

  public async load() {
    const keys = Object.keys(this.preference);

    const values = keys.map((key) => ({ key, value: localStorage.getItem(key) }));

    values.forEach((item) => {
      if (!item.value) return;

      switch (item.key) {
        case "theme":
          if (typeof item.value === "string") this.preference.theme = item.value as Theme;
          break;
        case "fontSize":
        case "lineHeight":
          if (typeof item.value === "string") this.preference[item.key] = item.value;
          break;
      }
    });

    return this.preference;
  }

  public async setItem<T extends keyof Preference>(key: T, value: Preference[T]) {
    this.preference[key] = value;
    return this.preference;
  }

  public async getItem<T extends keyof Preference>(key: T) {
    return this.preference[key];
  }
}
