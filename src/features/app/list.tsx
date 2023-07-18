import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "react-daisyui";

import { AddAction } from "@/components/epub/list/add";
import { ListItem } from "@/components/epub/list/item";
import { Storage } from "@/services/storage";
import { Entry } from "@/services/storage/entry";

export function List() {
  const [search, setSearch] = useState<string>("");
  const [entries, setEntries] = useState<Array<Entry>>([]);

  const searchFilterEntries = useMemo(() => {
    if (search.trim().length === 0) return entries;
    return entries.filter((entry) =>
      (typeof entry.metadata.root.package.metadata["dc:title"] === "string"
        ? entry.metadata.root.package.metadata["dc:title"]
        : entry.metadata.root.package.metadata["dc:title"]["#text"]
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [entries, search]);

  const fetchEntires = useCallback(async () => {
    setEntries(await Storage.getAll());
  }, [setEntries]);

  useEffect(() => {
    fetchEntires();
  }, [fetchEntires]);

  return (
    <main className="p-4" role="list">
      <div className="flex gap-4 items-center mb-4">
        <div className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-500 text-clip font-extrabold text-xl">
          Your library
        </div>
        <Input
          placeholder="Search your library"
          className="flex-grow"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <AddAction onFinish={fetchEntires} />
        <div className="col-span-2"></div>
        {searchFilterEntries.map((entry) => (
          <ListItem key={entry.id} entry={entry} />
        ))}
      </div>
    </main>
  );
}
