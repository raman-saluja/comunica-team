import { AppDispatch, AppState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser } from "./AuthSlice";

const IsAuthenticated = ({ children }: { children: JSX.Element }) => {
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
