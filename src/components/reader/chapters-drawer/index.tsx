import { ReactNode, useCallback, useMemo } from "react";
import { Badge, Drawer } from "react-daisyui";

import { Collapse } from "@/components/collapse";
import { ChapterListItem } from "@/services/parser/interfaces";
import { type Entry } from "@/services/storage/entry";

export interface ChapterDrawerProps {
  entry: Entry;
  open: boolean;
  onClose: () => unknown;
  children?: ReactNode;
  toc: ChapterListItem[];
  onChapterChange: (tocChapter: ChapterListItem) => unknown;
}

export function ChapterDrawer({ toc, open, onClose, children, onChapterChange }: ChapterDrawerProps) {
  const chapters = useCallback(
    (items: Array<ChapterListItem>, level = 0) => {
      return items.map((item) => {
        if (item.children) {
          return (
            <Collapse
              trigger={
                <div
                  className={`flex justify-between items-center ml-${level * 2} px-3 py-2 mb-2 bg-black bg-opacity-20`}
                  role="button"
                >
                  <span>{item.label}</span>
                  <Badge color="info" size="xs">
                    +{item.children.length}
                  </Badge>
                </div>
              }
              key={item.id}
            >
              {chapters(item.children, level + 1)}
            </Collapse>
          );
        }

        return (
          <div
            key={item.id}
            className={`ml-${level * 2} px-3 py-2 mb-2 bg-black bg-opacity-20`}
            role="button"
            onClick={() => {
              onChapterChange(item);
              onClose();
            }}
          >
            {item.label}
          </div>
        );
      });
    },
    [onChapterChange, onClose]
  );

  const sidebar = useMemo(() => {
    return (
      <aside className="bg-secondary text-secondary-content h-screen overflow-y-auto w-80">
        <div className="font-extrabold my-5 mx-3">Chapters</div>
        <section role="list">{chapters(toc)}</section>
      </aside>
    );
  }, [chapters, toc]);

  return (
    <Drawer side={sidebar} open={open} onClickOverlay={onClose}>
      {children}
    </Drawer>
  );
}
