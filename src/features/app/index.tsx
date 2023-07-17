import { FullPage } from "@/components/page/full";
import { lazyImportModule, ModuleType } from "@/services/import";

const LazyLoadedList = lazyImportModule(ModuleType.Feature, "app/list");

export function App() {
  return (
    <FullPage className="">
      <LazyLoadedList />
    </FullPage>
  );
}
