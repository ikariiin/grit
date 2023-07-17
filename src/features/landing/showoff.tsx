import { Button, Stats } from "react-daisyui";
import { MdBookmarks, MdLibraryBooks, MdShare } from "react-icons/md";

export function Showoff() {
  return (
    <section className="grid gap-4 grid-cols-3">
      <div className="col-span-2 flex justify-center">
        <Stats className="rounded-md border-2 border-neutral-700">
          <Stats.Stat>
            <Stats.Stat.Item variant="figure">
              <MdLibraryBooks className="text-5xl text-primary" />
            </Stats.Stat.Item>
            <Stats.Stat.Item variant="title">Books In Library</Stats.Stat.Item>
            <Stats.Stat.Item variant="value">9</Stats.Stat.Item>
          </Stats.Stat>
          <Stats.Stat>
            <Stats.Stat.Item variant="figure">
              <MdBookmarks className="text-5xl text-primary" />
            </Stats.Stat.Item>
            <Stats.Stat.Item variant="title">Bookmarks Stored</Stats.Stat.Item>
            <Stats.Stat.Item variant="value">4</Stats.Stat.Item>
          </Stats.Stat>
        </Stats>
      </div>
      <div className="flex items-center">
        <Button color="secondary" startIcon={<MdShare className="text-xl" />}>
          Get link for sharing library
        </Button>
      </div>
    </section>
  );
}
