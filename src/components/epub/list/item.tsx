import { HTMLProps } from "react";
import { Link } from "react-router-dom";

import { Entry } from "@/services/storage/entry";

export interface ListItemProps {
  entry: Entry;
}

export function ListItem({ entry, ...props }: ListItemProps & HTMLProps<HTMLDivElement>) {
  return (
    <Link to={`/app/${entry.id}`}>
      <div
        {...props}
        className={`grid grid-cols-list-item-layout p-3 h-44 mb-4 bg-secondary text-secondary-content gap-3 items-center ${
          props.className ?? ""
        }`}
        role="button"
      >
        <img
          src={entry.cover}
          alt={`${entry.metadata.root.package.metadata["dc:title"]} Book Cover`}
          className="object-cover w-full h-full object-center bg-slate-950"
        />
        <div>
          <h3 className="font-semibold text-xl">
            {typeof entry.metadata.root.package.metadata["dc:title"] === "string"
              ? entry.metadata.root.package.metadata["dc:title"]
              : entry.metadata.root.package.metadata["dc:title"]["#text"]}
          </h3>
          <h5 className="font-medium text-sm">{entry.metadata.root.package.metadata["dc:creator"]["#text"]}</h5>
        </div>
      </div>
    </Link>
  );
}
