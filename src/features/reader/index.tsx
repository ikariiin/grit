import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { Header } from "@/components/reader/header";
import { Render } from "@/components/reader/render";
import { HistoryStorage } from "@/services/history";
import { History } from "@/services/history/history";
import { LoaderData } from "@/services/loaders";
import { type readerLoader } from "@/services/loaders/reader";
import { ChapterListItem } from "@/services/parser/interfaces";
import { TOCParser } from "@/services/parser/toc";

export function Reader() {
  const readerData = useLoaderData() as LoaderData<typeof readerLoader>;
  const [loading, setLoading] = useState<boolean>(false);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [flatToc, setFlatToc] = useState<ChapterListItem[]>([]);
  const [toc, setToc] = useState<ChapterListItem[]>([]);
  const [tocChapter, setTocChapter] = useState<ChapterListItem | null>(null);

  const navigationHandlers = useCallback(
    (ev: KeyboardEvent) => {
      if (!tocChapter) return;

      const chIdx = flatToc.findIndex((toc) => toc.id === tocChapter.id);

      switch (ev.key) {
        case "ArrowLeft":
          // Previous chapter
          if (chIdx !== 0) {
            const previousTocChapter = flatToc[chIdx - 1];
            setCurrentChapterId(previousTocChapter.id);
            setTocChapter(previousTocChapter);
          }
          break;
        case "ArrowRight":
          // Next chapter
          if (chIdx !== flatToc.length - 1) {
            const nextTocChapter = flatToc[chIdx + 1];
            setCurrentChapterId(nextTocChapter.id);
            setTocChapter(nextTocChapter);
          }
          break;
      }
    },
    [flatToc, tocChapter]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", navigationHandlers);

    return () => document.body.removeEventListener("keydown", navigationHandlers);
  }, [navigationHandlers]);

  const parseTocNCX = useCallback(async () => {
    if (toc && toc.length !== 0) return;

    const tocParser = new TOCParser(readerData.parser, readerData.entry.metadata.root.package.manifest);
    await tocParser.parse();
    const list = await tocParser.getList();
    const flatList = TOCParser.flattenChapterList(list);
    setToc(list);
    setFlatToc(flatList);
  }, [toc, readerData.parser, readerData.entry]);

  useEffect(() => {
    parseTocNCX();
  }, [parseTocNCX]);

  const inferChapterIdFromHistory = useCallback(() => {
    if (currentChapterId) return;

    if (readerData.history.lastReadId) {
      setCurrentChapterId(readerData.history.lastReadId);
    } else {
      setCurrentChapterId(flatToc.at(0)?.id ?? null);
    }
  }, [readerData.history, flatToc, currentChapterId]);

  useEffect(() => {
    inferChapterIdFromHistory();
  }, [inferChapterIdFromHistory]);

  const updateHistory = useCallback(
    async (tocChapter: ChapterListItem) => {
      const history = readerData.history;
      if (!tocChapter.id && history.lastReadId === tocChapter.id) return;

      const updatedHistory = History.fromHistory({
        ...history,
        lastReadId: tocChapter.id,
        lastReadLabel: tocChapter.label,
      });
      const historyStorage = new HistoryStorage(updatedHistory);
      await historyStorage.save();
    },
    [readerData.history]
  );

  const loadCurrentChapter = useCallback(() => {
    if (!currentChapterId || flatToc.length === 0) return;

    const loadingDisplayTimeout = setTimeout(() => setLoading(true), 300);

    const chapter = flatToc.find((toc) => toc.id === currentChapterId);
    if (!chapter) {
      throw new Error("Could not correctly get chapter from history");
    }

    // If we complete the loading before 300ms has passed we do not need to flash the loading message
    // FIXME: does not work!!!
    clearTimeout(loadingDisplayTimeout);
    setLoading(false);
    setTocChapter(chapter);

    updateHistory(chapter);
  }, [currentChapterId, flatToc, updateHistory]);

  useEffect(() => {
    loadCurrentChapter();
  }, [loadCurrentChapter]);

  // To correctly set the loading state
  useEffect(() => {
    if (toc && tocChapter) setLoading(false);
  }, [toc, tocChapter]);

  const render = useMemo(() => {
    if (!tocChapter) return null;

    if (loading) return <div>Loading...</div>;
    return <Render parser={readerData.parser} src={tocChapter.src} />;
  }, [tocChapter, readerData.parser, loading]);

  const onChapterChange = useCallback((tocChapter: ChapterListItem) => {
    setTocChapter(tocChapter);
    setCurrentChapterId(tocChapter.id);
  }, []);

  return (
    <div className="min-h-screen w-screen py-14">
      <Header
        entry={readerData.entry}
        parser={readerData.parser}
        toc={toc}
        onChapterChange={onChapterChange}
        currentTocChapter={tocChapter}
      />
      {render}
    </div>
  );
}
