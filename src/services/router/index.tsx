import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { lazyImportModule, ModuleType } from "@/services/import";
import { readerLoader } from "@/services/loaders/reader";

const LazyLoadedLanding = lazyImportModule(ModuleType.Feature, "landing");
const LazyLoadedApp = lazyImportModule(ModuleType.Feature, "app");
const LazyLoadedReader = lazyImportModule(ModuleType.Feature, "reader");

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LazyLoadedLanding />,
    },
    {
      path: "/app",
      element: <LazyLoadedApp />,
    },
    {
      path: "/app/:id",
      element: <LazyLoadedReader />,
      loader: readerLoader,
    },
  ]);

  return <RouterProvider router={router} />;
}
