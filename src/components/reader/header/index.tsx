import { useState } from "react";
import { LiaEllipsisVSolid, LiaListOlSolid } from "react-icons/lia";

import { IconDisplay } from "@/components/icon-display";
import { ChapterDrawer } from "@/components/reader/chapters-drawer";
import { PreferenceEditor } from "@/components/reader/header/preference-editor";
import { EPUBParser } from "@/services/parser";
import { ChapterListItem } from "@/services/parser/interfaces";
import { type Entry } from "@/services/storage/entry";

export interface HeaderProps {
  entry: Entry;
  parser: EPUBParser;
  toc: ChapterListItem[];
  currentTocChapter: ChapterListItem | null;
  onChapterChange: (tocChapter: ChapterListItem) => unknown;
}

export function Header({ entry, toc, onChapterChange, currentTocChapter }: HeaderProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showPreference, setShowPreference] = useState<boolean>(false);

  return (
    <ChapterDrawer
      entry={entry}
      onClose={() => setShowDrawer(false)}
      open={showDrawer}
      toc={toc}
      onChapterChange={onChapterChange}
    >
      <div className="fixed top-0 left-0 right-0 bg-secondary text-secondary-content shadow-lg flex items-center gap-4 h-14 px-4 justify-between">
        <div className="flex items-center gap-4">
          <IconDisplay
            className="bg-gradient-to-r from-teal-500 to-indigo-500 text-teal-950"
            role="button"
            onClick={() => setShowDrawer(!showDrawer)}
          >
            <LiaListOlSolid />
          </IconDisplay>
          <div className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-500 text-clip">
            {typeof entry.metadata.root.package.metadata["dc:title"] === "string"
              ? entry.metadata.root.package.metadata["dc:title"]
              : entry.metadata.root.package.metadata["dc:title"]["#text"]}
          </div>
          <div className="text-xl hidden md:block">&mdash;</div>
          <div className="text-xl">{currentTocChapter?.label}</div>
        </div>
        <div className="flex items-center gap-2">
          <IconDisplay role="button" className="bg-teal-500 text-white" onClick={() => setShowPreference(true)}>
            <LiaEllipsisVSolid />
          </IconDisplay>
        </div>
      </div>
      <PreferenceEditor open={showPreference} onClose={() => setShowPreference(false)} />
    </ChapterDrawer>
  );
}
