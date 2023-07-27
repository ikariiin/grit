import { ElementRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const mainContainerRef = useRef<ElementRef<"div"> | null>(null);

  const navigatePreviousChapter = useCallback(() => {
    if (!tocChapter) return;

    const chIdx = flatToc.findIndex((toc) => toc.id === tocChapter.id);

    if (chIdx !== 0) {
      const previousTocChapter = flatToc[chIdx - 1];
      setCurrentChapterId(previousTocChapter.id);
      setTocChapter(previousTocChapter);
    }
  }, [flatToc, tocChapter]);

  const navigateNextChapter = useCallback(() => {
    if (!tocChapter) return;

    const chIdx = flatToc.findIndex((toc) => toc.id === tocChapter.id);

    if (chIdx !== flatToc.length - 1) {
      const nextTocChapter = flatToc[chIdx + 1];
      setCurrentChapterId(nextTocChapter.id);
      setTocChapter(nextTocChapter);
    }
  }, [flatToc, tocChapter]);

  const navigationHandlers = useCallback(
    (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "ArrowLeft":
          // Previous chapter
          navigatePreviousChapter();
          break;
        case "ArrowRight":
          // Next chapter
          navigateNextChapter();
          break;
      }
    },
    [navigateNextChapter, navigatePreviousChapter]
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

  const swipeHandler = useCallback(() => {
    let touchStartX = 0,
      touchEndX = 0,
      touchStartY = 0,
      touchEndY = 0;
    const checkDirection = () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
          // Right swipe
          navigatePreviousChapter();
        } else {
          // Left swipe
          navigateNextChapter();
        }
      }
    };
    const startHandler = (ev: TouchEvent) => {
      touchStartX = ev.changedTouches[0].screenX;
      touchStartY = ev.changedTouches[0].screenY;
    };
    const endHandler = (ev: TouchEvent) => {
      touchEndX = ev.changedTouches[0].screenX;
      touchEndY = ev.changedTouches[0].screenY;
      checkDirection();
    };

    document.addEventListener("touchstart", startHandler);
    document.addEventListener("touchend", endHandler);

    return () => {
      document.removeEventListener("touchstart", startHandler);
      document.removeEventListener("touchend", endHandler);
    };
  }, [navigateNextChapter, navigatePreviousChapter]);

  useEffect(swipeHandler, [swipeHandler]);

  return (
    <div className="min-h-screen w-screen py-14" ref={mainContainerRef}>
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
