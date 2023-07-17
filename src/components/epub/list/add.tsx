import { ChangeEvent as ReactChangeEvent, Fragment, useCallback, useRef } from "react";
import { LiaFileImportSolid } from "react-icons/lia";

import { IconDisplay } from "@/components/icon-display";
import { HistoryStorage } from "@/services/history";
import { Storage } from "@/services/storage";
import { Entry } from "@/services/storage/entry";

export interface AddActionProps {
  onFinish?: () => unknown;
}

export function AddAction({ onFinish }: AddActionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUpload = useCallback(
    async (ev: ReactChangeEvent<HTMLInputElement>) => {
      const files = ev.target.files;
      if (!files || !files[0]) return;

      const { entry, history } = await Entry.fromFile(files[0]);
      const storage = new Storage(entry);
      await storage.save();
      const historyStorage = new HistoryStorage(history);
      await historyStorage.save();

      if (onFinish) onFinish();
    },
    [onFinish]
  );

  return (
    <Fragment>
      <div
        className="bg-secondary text-base-content bg-opacity-10 p-6 flex items-center gap-3"
        role="button"
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" className="h-0 w-0 invisible" ref={fileInputRef} onChange={onUpload} accept=".epub" />
        <IconDisplay className="bg-teal-500 text-teal-950">
          <LiaFileImportSolid />
        </IconDisplay>
        <span className="text-2xl">Add a book</span>
      </div>
    </Fragment>
  );
}
