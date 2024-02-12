import "./index.css";
import React from "react";

import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
import { store } from "@/redux/store";
import Loading from "@/app/layout/Loading";
import { cn } from "./lib/utils";

function App() {
  return (
    <Provider store={store}>
      <React.Suspense fallback={<Loading />}>
        <div className={cn("min-h-screen bg-background font-sans antialiased")}>
          <Outlet />
        </div>
      </React.Suspense>
    </Provider>
  );
}

export default App;
