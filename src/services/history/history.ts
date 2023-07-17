import { v4 as uuid } from "uuid";

export class History {
  constructor(
    public readonly id: string = uuid(),
    public readonly entryId: string,
    public readonly lastReadId?: string,
    public readonly lastReadLabel?: string
  ) {}

  public static fromHistory(history: History): History {
    return new History(history.id, history.entryId, history.lastReadId, history.lastReadLabel);
  }
}
