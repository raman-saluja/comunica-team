import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import AppRoutes from "@/routes/web";

export default createBrowserRouter(
  [
    {
      id: "root",
      Component: App,
      loader: () => {
        return {};
      },
      children: AppRoutes,
    },
  ],
  { basename: "/" }
);
