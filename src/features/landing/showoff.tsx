import { useCallback, useEffect, useReducer } from "react";
import { Button, Stats } from "react-daisyui";
import { MdBookmarks, MdLibraryBooks, MdShare } from "react-icons/md";

import { HistoryStorage } from "@/services/history";
import { Storage } from "@/services/storage";

export enum StatActionKind {
  SET_BOOKS_NUM,
  SET_BOOKS_READING,
}

export interface StatAction {
  kind: StatActionKind;
  payload: number;
}

export type Stats = {
  booksNum: number;
  booksReading: number;
};

export function Showoff() {
  const [stats, statsReducer] = useReducer(
    (state: Stats, action: StatAction) => {
      const newState = { ...state };
      switch (action.kind) {
        case StatActionKind.SET_BOOKS_NUM:
          newState.booksNum = action.payload;
          break;
        case StatActionKind.SET_BOOKS_READING:
          newState.booksReading = action.payload;
          break;
      }
      return newState;
    },
    {
      booksNum: 0,
      booksReading: 0,
    }
  );

  const loadStats = useCallback(async () => {
    const booksNum = await Storage.count();
    statsReducer({ kind: StatActionKind.SET_BOOKS_NUM, payload: booksNum });
    const booksReading = await HistoryStorage.getAll();
    statsReducer({
      kind: StatActionKind.SET_BOOKS_READING,
      payload: booksReading.filter((history) => Boolean(history.lastReadId)).length,
    });
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <section className="grid gap-4 grid-cols-3">
      <div className="col-span-2 flex flex-col items-center">
        <Stats className="rounded-md border-2 border-neutral-700">
          <Stats.Stat>
            <Stats.Stat.Item variant="figure">
              <MdLibraryBooks className="text-5xl text-primary" />
            </Stats.Stat.Item>
            <Stats.Stat.Item variant="title">Books In Library</Stats.Stat.Item>
            <Stats.Stat.Item variant="value">{stats.booksNum}</Stats.Stat.Item>
          </Stats.Stat>
          <Stats.Stat>
            <Stats.Stat.Item variant="figure">
              <MdBookmarks className="text-5xl text-primary" />
            </Stats.Stat.Item>
            <Stats.Stat.Item variant="title">Currently Reading</Stats.Stat.Item>
            <Stats.Stat.Item variant="value">{stats.booksReading}</Stats.Stat.Item>
          </Stats.Stat>
        </Stats>
      </div>
      <div className="flex flex-col items-center">
        <Button color="secondary" disabled startIcon={<MdShare className="text-xl" />}>
          Get link for sharing library
        </Button>
        (wip!)
        <section className="text-gray-500 text-sm mt-4 prose text-right mr-12">
          Yes, even sharing to another device is done with peer to peer connections and never goes through our servers!
        </section>
      </div>
    </section>
  );
}
