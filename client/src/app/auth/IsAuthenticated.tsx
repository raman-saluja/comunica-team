import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, useLocation } from "react-router-dom";
import { getUser } from "./AuthSlice";
import { store } from "@/redux/store";

const IsAuthenticated = ({ children }: { children: JSX.Element }) => {
  let location = useLocation();

  useEffect(() => {
    store.dispatch(getUser()).then(() => {
      if (!store.getState().auth.status)
        return <Navigate to={"/"} state={{ from: location }} replace />;
    });
  }, []);

  return children;
};

export default IsAuthenticated;
