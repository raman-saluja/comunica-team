import React from "react";
import "./index.css";

import Loading from "@/app/layout/Loading";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
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
