import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "@/features/app";
import { Landing } from "@/features/landing";
import { Reader } from "@/features/reader";
import { readerLoader } from "@/services/loaders/reader";

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/app",
      element: <App />,
    },
    {
      path: "/app/:id",
      element: <Reader />,
      loader: readerLoader,
    },
  ]);

  return <RouterProvider router={router} />;
}
