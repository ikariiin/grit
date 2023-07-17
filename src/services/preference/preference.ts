export enum Theme {
  black = "black",
  light = "light",
}

export class Preference {
  public constructor(
    public fontSize: string = "1",
    public lineHeight: string = "1.6",
    public theme: Theme = Theme.black
  ) {}

  public static fromPreference({ fontSize, lineHeight, theme }: Preference) {
    return new Preference(fontSize, lineHeight, theme);
  }
}
