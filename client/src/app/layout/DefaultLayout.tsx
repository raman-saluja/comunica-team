import IsAuthenticated from "@/app/auth/IsAuthenticated";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { Outlet } from "react-router-dom";
import Loading from "./Loading";

function DefaultLayout() {
  return (
    <React.Suspense fallback={<Loading />}>
      <IsAuthenticated>
        <>
          <Outlet />
          <Toaster />
        </>
      </IsAuthenticated>
    </React.Suspense>
  );
}

export default DefaultLayout;
