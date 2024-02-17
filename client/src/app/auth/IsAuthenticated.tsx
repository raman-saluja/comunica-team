import { store } from "@/redux/store";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "./AuthSlice";

const IsAuthenticated = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  useEffect(() => {
    store.dispatch(getUser()).then(() => {
      if (!store.getState().auth.status)
        return <Navigate to={"/"} state={{ from: location }} replace />;
    });
  }, []);

  return children;
};

export default IsAuthenticated;
