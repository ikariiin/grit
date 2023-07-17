import { LoaderFunction } from "react-router-dom";

import { HistoryStorage } from "@/services/history";
import { EPUBParser } from "@/services/parser";
import { Storage } from "@/services/storage";

export type ReaderLoaderParams = {
  params: {
    id?: string;
  };
};

export const readerLoader = (async ({ params }: ReaderLoaderParams) => {
  const { id } = params;
  if (!id) throw new Error("Cannot find data for specified book");

  const entry = await Storage.getBook(id);
  if (!entry) throw new Error("Cannot find entry for specified book");

  const parser = new EPUBParser(entry.file);
  void (await parser.parse());

  const history = await HistoryStorage.getById(entry.historyId);
  if (!history) throw new Error("Could not find related history entry for sepcified entry");

  return {
    entry,
    parser,
    history,
  };
}) satisfies LoaderFunction;
