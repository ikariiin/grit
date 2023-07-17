import { v4 as uuid } from "uuid";

import { History } from "@/services/history/history";
import { EPUBParser } from "@/services/parser";
import { CoverParser } from "@/services/parser/cover";
import { IContainer, IRootFile } from "@/services/parser/interfaces";

export type TEntryMetadata = {
  container: IContainer;
  root: IRootFile;
};

export class Entry {
  constructor(
    public readonly id: string = uuid(),
    public readonly file: File,
    public readonly fileName: string,
    public readonly cover: string,
    public readonly historyId: string,
    public readonly metadata: TEntryMetadata
  ) {}

  static async fromFile(file: File): Promise<{ history: History; entry: Entry }> {
    const parser = new EPUBParser(file);
    await parser.parse();

    if (!parser.parsed) throw new Error("Could not parse file to create an entry");

    const coverParser = new CoverParser(parser);

    const entryId = uuid();
    const historyId = uuid();

    const history = new History(historyId, entryId);
    const entry = new Entry(entryId, file, file.name, await coverParser.getCover("base64"), historyId, {
      container: await parser.parseContainer(),
      root: await parser.parseRootInfo(),
    });

    return { history, entry };
  }
}
