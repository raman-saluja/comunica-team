import { AppDispatch, AppState, store } from "@/redux/store";
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "./AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const IsAuthenticated = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  const auth = useSelector((state: AppState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (!auth.status) {
      navigate("/login");
    }
  }, [auth]);

  return children;
};

export default IsAuthenticated;
